package com.nuriwoolim.pagebackend.domain.comment.dto;

import com.nuriwoolim.pagebackend.domain.comment.entity.Comment;

public record CommentPermissionContext(
	Comment comment,
	Long userId
) {
}

