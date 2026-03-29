package com.nuriwoolim.pagebackend.global.storage;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.nuriwoolim.pagebackend.global.exception.GlobalErrorCode;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

/**
 * 물리적 파일 I/O를 담당하는 공용 서비스
 */
@Slf4j
@Service
public class FileStorageService {

	/** 안전한 확장자만 허용하는 화이트리스트 패턴 (영숫자, 최대 10자) */
	private static final Pattern SAFE_EXTENSION_PATTERN = Pattern.compile("^[a-zA-Z0-9]{1,10}$");

	private final Path rootLocation;
	private final Path tempLocation;

	public FileStorageService(@Value("${file.storage.root-path}") String rootPath) {
		this.rootLocation = Paths.get(rootPath).toAbsolutePath().normalize();
		this.tempLocation = this.rootLocation.resolve("tmp").normalize();
	}

	@PostConstruct
	public void init() {
		try {
			Files.createDirectories(rootLocation);
			Files.createDirectories(tempLocation);
			log.info("파일 저장소 초기화 완료: root={}, temp={}", rootLocation, tempLocation);
		} catch (IOException e) {
			throw GlobalErrorCode.INTERNAL_SERVER_ERROR.toException("파일 저장소를 초기화할 수 없습니다: " + e.getMessage());
		}
	}

	/**
	 * 고유한 저장 파일명을 생성합니다.
	 * 확장자는 화이트리스트(영숫자)로 검증하여 경로 조작을 방지합니다.
	 */
	public String generateStoredFileName(String originalFileName) {
		String extension = extractSafeExtension(originalFileName);
		return UUID.randomUUID() + (extension.isEmpty() ? "" : "." + extension);
	}

	/**
	 * MultipartFile의 내용을 임시 디렉터리에 스트리밍으로 저장합니다.
	 * 바이트 배열을 힙에 올리지 않으므로 메모리 사용을 최소화합니다.
	 */
	public void saveToTempFile(MultipartFile file, String storedFileName) {
		Path tempPath = tempLocation.resolve(storedFileName).normalize();
		if (!tempPath.startsWith(tempLocation)) {
			throw GlobalErrorCode.BAD_REQUEST.toException("잘못된 파일 경로입니다: " + storedFileName);
		}
		try (InputStream in = file.getInputStream()) {
			Files.createDirectories(tempPath.getParent());
			Files.copy(in, tempPath, StandardCopyOption.REPLACE_EXISTING);
			log.info("임시 파일 저장 완료: {}", tempPath);
		} catch (IOException e) {
			throw GlobalErrorCode.INTERNAL_SERVER_ERROR.toException("임시 파일을 저장할 수 없습니다: " + e.getMessage());
		}
	}

	/**
	 * 임시 파일을 최종 저장 위치로 atomic move 합니다. (이벤트 리스너에서 호출)
	 * ATOMIC_MOVE를 시도하고, 지원하지 않는 파일시스템이면 일반 이동으로 폴백합니다.
	 */
	public void promoteTempFile(String storedFileName) {
		Path tempPath = tempLocation.resolve(storedFileName).normalize();
		Path targetPath = resolveAndValidate(storedFileName);
		try {
			Files.createDirectories(targetPath.getParent());
			try {
				Files.move(tempPath, targetPath, StandardCopyOption.ATOMIC_MOVE);
			} catch (IOException atomicEx) {
				// ATOMIC_MOVE가 지원되지 않는 경우 일반 이동으로 폴백
				Files.move(tempPath, targetPath, StandardCopyOption.REPLACE_EXISTING);
			}
			log.info("파일 승격 완료: temp → {}", storedFileName);
		} catch (IOException e) {
			log.error("파일 승격 실패: {}", storedFileName, e);
			throw GlobalErrorCode.INTERNAL_SERVER_ERROR.toException("파일을 최종 경로로 이동할 수 없습니다: " + e.getMessage());
		}
	}

	/**
	 * 임시 파일을 삭제합니다. (트랜잭션 롤백 시 정리용)
	 */
	public void deleteTempFile(String storedFileName) {
		Path tempPath = tempLocation.resolve(storedFileName).normalize();
		try {
			if (Files.exists(tempPath)) {
				Files.delete(tempPath);
				log.info("임시 파일 삭제 완료: {}", storedFileName);
			}
		} catch (IOException e) {
			log.warn("임시 파일 삭제 실패 (무시): {}", storedFileName, e);
		}
	}

	/**
	 * storedFileName 기반으로 디스크에서 파일을 삭제합니다. (이벤트 리스너에서 호출)
	 */
	public void deleteFromDisk(String storedFileName) {
		Path path = resolveAndValidate(storedFileName);
		try {
			if (Files.exists(path)) {
				Files.delete(path);
				log.info("파일 삭제 완료: {}", storedFileName);
			}
		} catch (IOException e) {
			log.error("파일 삭제 실패: {}", storedFileName, e);
			throw GlobalErrorCode.INTERNAL_SERVER_ERROR.toException("파일을 삭제할 수 없습니다: " + e.getMessage());
		}
	}

	/**
	 * storedFileName 기반으로 파일을 Resource로 로드합니다. (다운로드용)
	 */
	public Resource loadAsResource(String storedFileName) {
		Path path = resolveAndValidate(storedFileName);
		try {
			Resource resource = new UrlResource(path.toUri());
			if (!resource.exists() || !resource.isReadable()) {
				throw GlobalErrorCode.DATA_NOT_FOUND.toException("파일을 찾을 수 없습니다: " + storedFileName);
			}
			return resource;
		} catch (IOException e) {
			throw GlobalErrorCode.DATA_NOT_FOUND.toException("파일을 로드할 수 없습니다: " + e.getMessage());
		}
	}

	/**
	 * 저장 경로의 전체 경로를 생성합니다. (내부 DB 저장용)
	 */
	public String resolveFilePath(String storedFileName) {
		return rootLocation.resolve(storedFileName).normalize().toString();
	}

	/**
	 * storedFileName을 rootLocation 기준으로 resolve + normalize 한 뒤,
	 * 최종 경로가 반드시 rootLocation 하위인지 검증합니다.
	 */
	private Path resolveAndValidate(String storedFileName) {
		Path resolved = rootLocation.resolve(storedFileName).normalize();
		if (!resolved.startsWith(rootLocation)) {
			throw GlobalErrorCode.BAD_REQUEST.toException("잘못된 파일 경로입니다: " + storedFileName);
		}
		return resolved;
	}

	/**
	 * 파일명에서 확장자를 추출하되, 화이트리스트(영숫자)에 맞지 않으면 빈 문자열을 반환합니다.
	 */
	private String extractSafeExtension(String fileName) {
		if (fileName == null || !fileName.contains(".")) {
			return "";
		}
		String extension = fileName.substring(fileName.lastIndexOf(".") + 1);
		if (!SAFE_EXTENSION_PATTERN.matcher(extension).matches()) {
			return "";
		}
		return extension;
	}
}
