package com.nuriwoolim.pagebackend.global.storage.entity;

/**
 * 고아 파일 로그 상태
 */
public enum OrphanFileStatus {
	/** 아직 정리되지 않음 */
	PENDING,
	/** 수동/배치 정리 완료 */
	RESOLVED
}

