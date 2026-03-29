package com.nuriwoolim.pagebackend.global.storage.event;

import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.nuriwoolim.pagebackend.global.storage.FileStorageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * TransactionalEventListener를 활용하여 DB 트랜잭션과 파일 I/O의 일관성을 보장합니다.
 * - AFTER_COMMIT: DB 커밋 성공 후에만 파일 저장/삭제 수행
 * - DB 롤백 시 파일 I/O가 실행되지 않으므로 불일치 방지
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FileEventListener {

	private final FileStorageService fileStorageService;

	/**
	 * 트랜잭션 커밋 후 파일을 디스크에 저장합니다.
	 */
	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleFileSave(FileSaveEvent event) {
		log.info("파일 저장 이벤트 수신: {}", event.storedFileName());
		fileStorageService.saveToFile(event.filePath(), event.content());
	}

	/**
	 * 트랜잭션 커밋 후 파일을 디스크에서 삭제합니다.
	 */
	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleFileDelete(FileDeleteEvent event) {
		log.info("파일 삭제 이벤트 수신: {}", event.filePath());
		fileStorageService.deleteFromDisk(event.filePath());
	}
}

