package com.nuriwoolim.pagebackend.domain.board.permission;

import com.nuriwoolim.pagebackend.domain.board.entity.Board;

public record BoardPermissionContext(
	Board board,
	Long userId
) {
}
