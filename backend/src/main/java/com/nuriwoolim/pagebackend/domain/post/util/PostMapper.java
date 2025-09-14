package com.nuriwoolim.pagebackend.domain.post.util;

import com.nuriwoolim.pagebackend.domain.board.entity.Board;
import com.nuriwoolim.pagebackend.domain.post.dto.PostCreateRequest;
import com.nuriwoolim.pagebackend.domain.post.dto.PostResponse;
import com.nuriwoolim.pagebackend.domain.post.entity.Post;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class PostMapper {

    public static PostResponse toPostResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .type(post.getType())
                .writerId(post.getWriter().getId())
                .writerName(post.getWriter().getName())
                .boardId(post.getBoard().getId())
                .boardTitle(post.getBoard().getTitle())
                .build();
    }

    public static Post fromBoardCreateRequest(PostCreateRequest request, User writer, Board board) {
        Post.PostBuilder builder = Post.builder()
                                    .title(request.title())
                                    .content(request.content())
                                    .type(request.type())
                                    .writer(writer)
                                    .board(board);

        return builder.build();
    }
}
