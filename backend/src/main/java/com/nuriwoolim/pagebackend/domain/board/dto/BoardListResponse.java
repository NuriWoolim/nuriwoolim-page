package com.nuriwoolim.pagebackend.domain.board.dto;

import java.util.List;

import lombok.Builder;

@Builder
public record BoardListResponse(
	List<BoardPreviewResponse> data,
	long totalElements,
	int totalPages,
	int currentPage
	//long instead of Long because long is immutable and cannot be null, while Long can be null.
	//totalElements is a required field, so using long ensures that it will always have a value.
) {
}
