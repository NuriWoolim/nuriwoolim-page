package com.nuriwoolim.pagebackend.domain.post.dto;

import com.nuriwoolim.pagebackend.domain.post.entity.Post;

public record PostPermissionContext(
	Post post,
	Long userId
) {
}
