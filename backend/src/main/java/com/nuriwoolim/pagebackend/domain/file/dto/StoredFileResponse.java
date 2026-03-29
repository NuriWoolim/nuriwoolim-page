package com.nuriwoolim.pagebackend.domain.file.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(description = "파일 응답 정보")
public record StoredFileResponse(
	@Schema(description = "파일 ID", example = "1")
	Long id,

	@Schema(description = "파일 저장 경로", example = "/home/user/nurim-file/abc123-456def.jpg")
	String path,

	@Schema(description = "파일 타입", example = "image/jpeg")
	String contentType,

	@Schema(description = "파일 크기 (bytes)", example = "1024000")
	Long fileSize
) {
}



