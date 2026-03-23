package com.nuriwoolim.pagebackend.domain.comment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record CommentCreateRequest(
	@NotNull
	Long postId,
	@NotBlank
	String content
) {
}

