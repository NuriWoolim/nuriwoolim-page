package com.nuriwoolim.pagebackend.domain.file.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.nuriwoolim.pagebackend.domain.file.dto.StoredFileResponse;
import com.nuriwoolim.pagebackend.domain.file.entity.StoredFile;
import com.nuriwoolim.pagebackend.domain.file.event.FileDeleteEvent;
import com.nuriwoolim.pagebackend.domain.file.event.FileSaveEvent;
import com.nuriwoolim.pagebackend.domain.file.repository.StoredFileRepository;
import com.nuriwoolim.pagebackend.domain.file.util.StoredFileMapper;
import com.nuriwoolim.pagebackend.global.exception.GlobalErrorCode;
import com.nuriwoolim.pagebackend.global.storage.FileStorageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class StoredFileService {

	private final StoredFileRepository storedFileRepository;
	private final FileStorageService fileStorageService;
	private final ApplicationEventPublisher eventPublisher;

	/**
	 * 파일 업로드 (DB 저장 + 트랜잭션 커밋 후 디스크 저장)
	 */
	@Transactional
	public StoredFileResponse upload(MultipartFile file) {
		String originalFileName = file.getOriginalFilename();
		String storedFileName = fileStorageService.generateStoredFileName(originalFileName);
		String filePath = fileStorageService.resolveFilePath(storedFileName);
		byte[] content = fileStorageService.readBytes(file);

		StoredFile storedFile = StoredFile.builder()
			.originalFileName(originalFileName)
			.storedFileName(storedFileName)
			.filePath(filePath)
			.contentType(file.getContentType())
			.fileSize(file.getSize())
			.build();

		StoredFile saved = storedFileRepository.save(storedFile);

		// 트랜잭션 커밋 후 파일 저장 이벤트 발행
		eventPublisher.publishEvent(new FileSaveEvent(storedFileName, content, filePath));

		return StoredFileMapper.toResponse(saved);
	}

	/**
	 * 파일 단건 조회
	 */
	@Transactional(readOnly = true)
	public StoredFileResponse getById(Long fileId) {
		StoredFile file = getStoredFileById(fileId);
		return StoredFileMapper.toResponse(file);
	}

	/**
	 * 파일 전체 목록 조회
	 */
	@Transactional(readOnly = true)
	public List<StoredFileResponse> getAll() {
		return storedFileRepository.findAll().stream()
			.map(StoredFileMapper::toResponse)
			.collect(Collectors.toList());
	}

	/**
	 * 파일 다운로드 리소스 로드
	 */
	@Transactional(readOnly = true)
	public Resource loadFileAsResource(Long fileId) {
		StoredFile file = getStoredFileById(fileId);
		return fileStorageService.loadAsResource(file.getFilePath());
	}

	/**
	 * 파일 다운로드 시 원본 파일명 조회
	 */
	@Transactional(readOnly = true)
	public String getOriginalFileName(Long fileId) {
		return getStoredFileById(fileId).getOriginalFileName();
	}

	/**
	 * 파일 삭제 (DB 삭제 + 트랜잭션 커밋 후 디스크 삭제)
	 */
	@Transactional
	public void delete(Long fileId) {
		StoredFile file = getStoredFileById(fileId);
		String filePath = file.getFilePath();

		storedFileRepository.delete(file);

		// 트랜잭션 커밋 후 파일 삭제 이벤트 발행
		eventPublisher.publishEvent(new FileDeleteEvent(filePath));
	}

	/**
	 * 내부 조회용 (서비스 레이어)
	 */
	public StoredFile getStoredFileById(Long fileId) {
		return storedFileRepository.findById(fileId)
			.orElseThrow(GlobalErrorCode.DATA_NOT_FOUND::toException);
	}
}




