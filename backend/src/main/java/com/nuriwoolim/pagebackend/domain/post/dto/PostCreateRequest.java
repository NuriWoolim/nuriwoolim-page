package com.nuriwoolim.pagebackend.domain.post.dto;

import com.nuriwoolim.pagebackend.domain.post.entity.PostType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record PostCreateRequest(
    Long boardId,
    @NotBlank
    String title,
    @NotBlank
    String content,
    @NotNull
    PostType type
) {
}
