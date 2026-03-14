package com.nuriwoolim.pagebackend.domain.post.dto;

import com.nuriwoolim.pagebackend.domain.post.entity.PostType;

import lombok.Builder;

@Builder
public record PostPreviewResponse(
	Long id,
	String title,
	PostType type,
	Long writerId,
	String writerName
) {
}
