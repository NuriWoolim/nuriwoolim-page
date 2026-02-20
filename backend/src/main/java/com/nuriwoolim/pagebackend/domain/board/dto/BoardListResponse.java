package com.nuriwoolim.pagebackend.domain.board.dto;

import lombok.Builder;

import java.util.List;

@Builder
public record BoardListResponse(
        List<BoardResponse> data
) {
}
