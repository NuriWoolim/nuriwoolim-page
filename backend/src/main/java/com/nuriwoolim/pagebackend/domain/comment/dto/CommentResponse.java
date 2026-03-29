package com.nuriwoolim.pagebackend.domain.comment.dto;

import com.nuriwoolim.pagebackend.domain.post.entity.PostType;
import com.nuriwoolim.pagebackend.global.permission.dto.PermissionDto;

import lombok.Builder;

@Builder
public record CommentResponse(
	Long id,
	String content,
	Long writerId,
	String writerName,
	Long postId,
	String postTitle,
	PermissionDto permission
) {
}

