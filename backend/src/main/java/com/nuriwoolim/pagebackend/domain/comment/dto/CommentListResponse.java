package com.nuriwoolim.pagebackend.domain.comment.dto;

import java.util.List;

import lombok.Builder;

@Builder
public record CommentListResponse(
	List<CommentResponse> data,
	long totalElements,
	int totalPages,
	int currentPage
) {
}

