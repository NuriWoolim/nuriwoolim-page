package com.nuriwoolim.pagebackend.domain.file.event;

/**
 * 파일 저장 이벤트 - 트랜잭션 커밋 후 실제 파일을 디스크에 저장
 */
public record FileSaveEvent(
	String storedFileName,
	byte[] content,
	String filePath
) {
}

