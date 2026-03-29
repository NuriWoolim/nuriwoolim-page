package com.nuriwoolim.pagebackend.domain.file.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(description = "파일 응답 정보")
public record StoredFileResponse(
	@Schema(description = "파일 ID", example = "1")
	Long id,

	@Schema(description = "저장된 파일명 (식별자)", example = "550e8400-e29b-41d4-a716-446655440000.jpg")
	String storedFileName,

	@Schema(description = "파일 다운로드 URL", example = "/files/1/download")
	String downloadUrl,

	@Schema(description = "파일 타입", example = "image/jpeg")
	String contentType,

	@Schema(description = "파일 크기 (bytes)", example = "1024000")
	Long fileSize
) {
}
