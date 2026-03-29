package com.nuriwoolim.pagebackend.global.storage.event;

/**
 * 파일 저장 이벤트 - 트랜잭션 커밋 후 임시 파일을 최종 경로로 이동
 * 바이트 배열 대신 storedFileName만 전달하여 메모리 사용을 최소화합니다.
 */
public record FileSaveEvent(
	Long fileId,
	String storedFileName
) {
}
