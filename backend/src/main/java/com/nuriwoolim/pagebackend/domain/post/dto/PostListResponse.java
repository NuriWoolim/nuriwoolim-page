package com.nuriwoolim.pagebackend.domain.post.dto;

import java.util.List;

import lombok.Builder;

@Builder
public record PostListResponse(
	List<PostPreviewResponse> data,
	long totalElements,
	int totalPages,
	int currentPage
) {
}
