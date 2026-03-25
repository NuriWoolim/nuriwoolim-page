package com.nuriwoolim.pagebackend.domain.board.dto;

import com.nuriwoolim.pagebackend.domain.board.entity.BoardType;
import com.nuriwoolim.pagebackend.global.permission.dto.PermissionDto;

import lombok.Builder;

@Builder
public record BoardResponse(
	Long id,
	String title,
	String description,
	BoardType type,
	PermissionDto permission
) {
}
