package com.nuriwoolim.pagebackend.domain.post.dto;

import com.nuriwoolim.pagebackend.domain.post.entity.PostType;
import lombok.Builder;

@Builder
public record PostUpdateRequest(
        String title,
        String content,
        PostType type
) {

}

