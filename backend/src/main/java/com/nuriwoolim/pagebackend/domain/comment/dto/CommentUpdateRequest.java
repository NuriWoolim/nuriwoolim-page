package com.nuriwoolim.pagebackend.domain.comment.dto;

import lombok.Builder;

@Builder
public record CommentUpdateRequest(
	String content
) {
}

