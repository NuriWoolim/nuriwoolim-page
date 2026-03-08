package com.nuriwoolim.pagebackend.domain.board.dto;

import java.util.List;

import lombok.Builder;

@Builder
public record BoardListResponse(
	List<BoardResponse> data
) {
}
