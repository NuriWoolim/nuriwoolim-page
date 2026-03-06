package com.nuriwoolim.pagebackend.domain.post.dto;

import com.nuriwoolim.pagebackend.domain.post.entity.PostType;
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
    String boardTitle
) {
}
