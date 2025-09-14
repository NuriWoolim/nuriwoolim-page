package com.nuriwoolim.pagebackend.domain.post.dto;

import com.nuriwoolim.pagebackend.domain.board.entity.Board;
import com.nuriwoolim.pagebackend.domain.post.entity.PostType;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
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
