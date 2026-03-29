package com.nuriwoolim.pagebackend.global.storage.event;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.nuriwoolim.pagebackend.domain.file.repository.StoredFileRepository;
import com.nuriwoolim.pagebackend.global.storage.FileStorageService;
import com.nuriwoolim.pagebackend.global.storage.entity.OrphanFileLog;
import com.nuriwoolim.pagebackend.global.storage.repository.OrphanFileLogRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * TransactionalEventListener를 활용하여 DB 트랜잭션과 파일 I/O의 일관성을 보장합니다.
 * - AFTER_COMMIT: DB 커밋 성공 후에만 파일 저장/삭제 수행
 * - @Async: 파일 I/O를 비동기로 처리하여 응답 지연 방지
 * - 실패 시 보상 트랜잭션을 수행하여 DB-파일 일관성 유지
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FileEventListener {

	private final FileStorageService fileStorageService;
	private final StoredFileRepository storedFileRepository;
	private final OrphanFileLogRepository orphanFileLogRepository;

	/**
	 * 트랜잭션 커밋 후 파일을 디스크에 비동기 저장합니다.
	 * 실패 시 DB 레코드를 삭제(보상 트랜잭션)하여 DB-파일 불일치를 방지합니다.
	 */
	@Async
	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleFileSave(FileSaveEvent event) {
		log.info("[Async] 파일 저장 이벤트 수신: {}", event.storedFileName());
		try {
			fileStorageService.saveToFile(event.storedFileName(), event.content());
		} catch (Exception e) {
			log.error("[보상 트랜잭션] 파일 디스크 저장 실패, DB 레코드 삭제 시도 - storedFileName={}, fileId={}",
				event.storedFileName(), event.fileId(), e);
			try {
				storedFileRepository.deleteById(event.fileId());
				log.info("[보상 트랜잭션] DB 레코드 삭제 완료 - fileId={}", event.fileId());
			} catch (Exception compensationEx) {
				log.error("[보상 트랜잭션] DB 레코드 삭제 실패 - fileId={}. 수동 정리가 필요합니다.",
					event.fileId(), compensationEx);
			}
		}
	}

	/**
	 * 트랜잭션 커밋 후 파일을 디스크에서 비동기 삭제합니다.
	 * 실패 시 tb_orphan_file_log 테이블에 기록하여 추후 배치/수동 정리를 지원합니다.
	 */
	@Async
	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleFileDelete(FileDeleteEvent event) {
		log.info("[Async] 파일 삭제 이벤트 수신: {}", event.storedFileName());
		try {
			fileStorageService.deleteFromDisk(event.storedFileName());
		} catch (Exception e) {
			log.error("[파일 삭제 실패] 고아 파일 로그를 DB에 기록합니다 - storedFileName={}", event.storedFileName(), e);
			try {
				orphanFileLogRepository.save(
					OrphanFileLog.builder()
						.storedFileName(event.storedFileName())
						.reason(e.getClass().getSimpleName() + ": " + e.getMessage())
						.build()
				);
				log.info("[고아 파일 로그] DB 기록 완료 - storedFileName={}", event.storedFileName());
			} catch (Exception dbEx) {
				log.error("[고아 파일 로그] DB 기록마저 실패 - storedFileName={}. 수동 정리가 필요합니다.",
					event.storedFileName(), dbEx);
			}
		}
	}
}
