package com.nuriwoolim.pagebackend.global.storage.scheduler;

import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.nuriwoolim.pagebackend.global.storage.FileStorageService;
import com.nuriwoolim.pagebackend.global.storage.entity.OrphanFileLog;
import com.nuriwoolim.pagebackend.global.storage.entity.OrphanFileStatus;
import com.nuriwoolim.pagebackend.global.storage.repository.OrphanFileLogRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 주기적으로 PENDING 상태의 고아 파일 삭제를 재시도하는 스케줄러.
 * 매주 월요일 새벽 3시에 실행됩니다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OrphanFileCleanupScheduler {

	private final OrphanFileLogRepository orphanFileLogRepository;
	private final FileStorageService fileStorageService;

	/**
	 * 매주 월요일 03:00에 PENDING 고아 파일 삭제를 재시도합니다.
	 * - 삭제 성공 → RESOLVED로 상태 변경
	 * - 삭제 실패 → PENDING 유지, 다음 주기에 재시도
	 */
	@Scheduled(cron = "0 0 3 ? * MON")
	@Transactional
	public void retryOrphanFileDeletion() {
		List<OrphanFileLog> pendingLogs = orphanFileLogRepository.findByStatus(OrphanFileStatus.PENDING);

		if (pendingLogs.isEmpty()) {
			log.info("[고아 파일 정리] PENDING 상태의 고아 파일이 없습니다.");
			return;
		}

		log.info("[고아 파일 정리] {}건의 고아 파일 삭제를 재시도합니다.", pendingLogs.size());

		int successCount = 0;
		int failCount = 0;

		for (OrphanFileLog orphanLog : pendingLogs) {
			try {
				fileStorageService.deleteFromDisk(orphanLog.getStoredFileName());
				orphanLog.markResolved();
				successCount++;
				log.info("[고아 파일 정리] 삭제 성공 - storedFileName={}", orphanLog.getStoredFileName());
			} catch (Exception e) {
				failCount++;
				log.warn("[고아 파일 정리] 삭제 재시도 실패 - storedFileName={}, reason={}",
					orphanLog.getStoredFileName(), e.getMessage());
			}
		}

		log.info("[고아 파일 정리] 완료 - 성공: {}건, 실패: {}건", successCount, failCount);
	}
}

