package com.nuriwoolim.pagebackend.domain.board.dto;

import com.nuriwoolim.pagebackend.domain.board.entity.Board;

public record BoardPermissionContext(
	Board board,
	Long userId
) {
}
