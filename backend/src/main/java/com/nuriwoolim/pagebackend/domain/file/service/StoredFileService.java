package com.nuriwoolim.pagebackend.domain.file.service;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.nuriwoolim.pagebackend.domain.file.dto.StoredFileResponse;
import com.nuriwoolim.pagebackend.domain.file.entity.StoredFile;
import com.nuriwoolim.pagebackend.global.storage.event.FileDeleteEvent;
import com.nuriwoolim.pagebackend.global.storage.event.FileSaveEvent;
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
	 * 파일 업로드 (임시 파일 스트리밍 저장 → DB 저장 → 트랜잭션 커밋 후 최종 위치 이동)
	 * 바이트 배열을 힙에 올리지 않으므로 동시 업로드 시 메모리 사용을 최소화합니다.
	 */
	@Transactional
	public StoredFileResponse upload(MultipartFile file) {
		String originalFileName = file.getOriginalFilename();
		String storedFileName = fileStorageService.generateStoredFileName(originalFileName);
		String filePath = fileStorageService.resolveFilePath(storedFileName);

		// 1. MultipartFile → 임시 파일로 스트리밍 저장 (메모리에 바이트 배열을 올리지 않음)
		fileStorageService.saveToTempFile(file, storedFileName);

		StoredFile storedFile = StoredFile.builder()
			.originalFileName(originalFileName)
			.storedFileName(storedFileName)
			.filePath(filePath)
			.contentType(file.getContentType())
			.fileSize(file.getSize())
			.build();

		StoredFile saved = storedFileRepository.save(storedFile);

		// 2. 트랜잭션 커밋 후 임시 파일 → 최종 경로 이동 이벤트 발행 (바이트 배열 없음)
		eventPublisher.publishEvent(new FileSaveEvent(saved.getId(), storedFileName));

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
	 * 파일 목록 조회 (페이징)
	 */
	@Transactional(readOnly = true)
	public Page<StoredFileResponse> getAll(Pageable pageable) {
		return storedFileRepository.findAll(pageable)
			.map(StoredFileMapper::toResponse);
	}

	/**
	 * 파일 다운로드 리소스 로드 (storedFileName 기반)
	 */
	@Transactional(readOnly = true)
	public Resource loadFileAsResource(String storedFileName) {
		getStoredFileByStoredFileName(storedFileName); // 존재 여부 검증
		return fileStorageService.loadAsResource(storedFileName);
	}

	/**
	 * 파일 다운로드 시 원본 파일명 조회 (storedFileName 기반)
	 */
	@Transactional(readOnly = true)
	public String getOriginalFileName(String storedFileName) {
		return getStoredFileByStoredFileName(storedFileName).getOriginalFileName();
	}

	/**
	 * 파일 삭제 (DB 삭제 + 트랜잭션 커밋 후 디스크 삭제)
	 */
	@Transactional
	public void delete(Long fileId) {
		StoredFile file = getStoredFileById(fileId);
		String storedFileName = file.getStoredFileName();

		storedFileRepository.delete(file);

		// 트랜잭션 커밋 후 파일 삭제 이벤트 발행 (storedFileName 기반)
		eventPublisher.publishEvent(new FileDeleteEvent(storedFileName));
	}

	/**
	 * 내부 조회용 - fileId 기반 (서비스 레이어)
	 */
	public StoredFile getStoredFileById(Long fileId) {
		return storedFileRepository.findById(fileId)
			.orElseThrow(GlobalErrorCode.DATA_NOT_FOUND::toException);
	}

	/**
	 * 내부 조회용 - storedFileName 기반 (서비스 레이어)
	 */
	public StoredFile getStoredFileByStoredFileName(String storedFileName) {
		return storedFileRepository.findByStoredFileName(storedFileName)
			.orElseThrow(GlobalErrorCode.DATA_NOT_FOUND::toException);
	}
}
