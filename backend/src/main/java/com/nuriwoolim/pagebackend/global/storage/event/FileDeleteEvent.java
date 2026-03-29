package com.nuriwoolim.pagebackend.global.storage.event;

/**
 * 파일 삭제 이벤트 - 트랜잭션 커밋 후 실제 파일을 디스크에서 삭제
 */
public record FileDeleteEvent(
	String filePath
) {
}

