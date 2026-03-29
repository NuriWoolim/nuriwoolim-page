package com.nuriwoolim.pagebackend.global.storage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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

	public FileStorageService(@Value("${file.storage.root-path}") String rootPath) {
		this.rootLocation = Paths.get(rootPath).toAbsolutePath().normalize();
	}

	@PostConstruct
	public void init() {
		try {
			Files.createDirectories(rootLocation);
			log.info("파일 저장소 초기화 완료: {}", rootLocation);
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
	 * MultipartFile의 내용을 바이트 배열로 읽어옵니다.
	 */
	public byte[] readBytes(MultipartFile file) {
		try {
			return file.getBytes();
		} catch (IOException e) {
			throw GlobalErrorCode.INTERNAL_SERVER_ERROR.toException("파일을 읽을 수 없습니다: " + e.getMessage());
		}
	}

	/**
	 * storedFileName 기반으로 바이트 배열을 디스크에 저장합니다. (이벤트 리스너에서 호출)
	 */
	public void saveToFile(String storedFileName, byte[] content) {
		Path targetPath = resolveAndValidate(storedFileName);
		try {
			Files.createDirectories(targetPath.getParent());
			Files.write(targetPath, content);
			log.info("파일 저장 완료: {}", storedFileName);
		} catch (IOException e) {
			log.error("파일 저장 실패: {}", storedFileName, e);
			throw GlobalErrorCode.INTERNAL_SERVER_ERROR.toException("파일을 저장할 수 없습니다: " + e.getMessage());
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
