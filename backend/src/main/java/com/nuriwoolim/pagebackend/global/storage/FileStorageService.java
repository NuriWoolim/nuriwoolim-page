package com.nuriwoolim.pagebackend.global.storage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.nuriwoolim.pagebackend.global.exception.GlobalErrorCode;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 물리적 파일 I/O를 담당하는 공용 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FileStorageService {

	private final Path rootLocation = Paths.get(System.getProperty("user.home"), "nurim-file")
		.toAbsolutePath()
		.normalize();

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
	 */
	public String generateStoredFileName(String originalFileName) {
		String extension = extractExtension(originalFileName);
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
	 * 바이트 배열을 디스크에 저장합니다. (이벤트 리스너에서 호출)
	 */
	public void saveToFile(String filePath, byte[] content) {
		try {
			Path targetPath = Paths.get(filePath);
			Files.createDirectories(targetPath.getParent());
			Files.write(targetPath, content);
			log.info("파일 저장 완료: {}", targetPath);
		} catch (IOException e) {
			log.error("파일 저장 실패: {}", filePath, e);
			throw GlobalErrorCode.INTERNAL_SERVER_ERROR.toException("파일을 저장할 수 없습니다: " + e.getMessage());
		}
	}

	/**
	 * 디스크에서 파일을 삭제합니다. (이벤트 리스너에서 호출)
	 */
	public void deleteFromDisk(String filePath) {
		try {
			Path path = Paths.get(filePath);
			if (Files.exists(path)) {
				Files.delete(path);
				log.info("파일 삭제 완료: {}", path);
			}
		} catch (IOException e) {
			log.error("파일 삭제 실패: {}", filePath, e);
		}
	}

	/**
	 * 파일을 Resource로 로드합니다. (다운로드용)
	 */
	public Resource loadAsResource(String filePath) {
		try {
			Path path = Paths.get(filePath);
			Resource resource = new UrlResource(path.toUri());
			if (!resource.exists() || !resource.isReadable()) {
				throw GlobalErrorCode.DATA_NOT_FOUND.toException("파일을 찾을 수 없습니다: " + filePath);
			}
			return resource;
		} catch (IOException e) {
			throw GlobalErrorCode.DATA_NOT_FOUND.toException("파일을 로드할 수 없습니다: " + e.getMessage());
		}
	}

	/**
	 * 저장 경로의 전체 경로를 생성합니다.
	 */
	public String resolveFilePath(String storedFileName) {
		return rootLocation.resolve(storedFileName).toString();
	}

	private String extractExtension(String fileName) {
		if (fileName == null || !fileName.contains(".")) {
			return "";
		}
		return fileName.substring(fileName.lastIndexOf(".") + 1);
	}
}

