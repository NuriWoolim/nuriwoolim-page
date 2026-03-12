package com.nuriwoolim.pagebackend.domain.comment.dto;

import lombok.Builder;

@Builder
public record CommentResponse(
	Long id,
	String content,
	Long writerId,
	String writerName,
	Long postId,
	String postTitle
) {
}

