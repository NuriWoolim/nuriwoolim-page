package com.nuriwoolim.pagebackend.domain.post.dto;

import java.security.Permission;

import com.nuriwoolim.pagebackend.domain.post.entity.PostType;
import com.nuriwoolim.pagebackend.global.permission.dto.PermissionDto;

import lombok.Builder;

@Builder
public record PostResponse(
	Long id,
	String title,
	String content,
	PostType type,
	Long writerId,
	String writerName,
	Long boardId,
	String boardTitle,
	PermissionDto permission
) {
}
