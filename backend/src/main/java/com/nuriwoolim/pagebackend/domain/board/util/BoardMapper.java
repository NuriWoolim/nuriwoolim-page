package com.nuriwoolim.pagebackend.domain.board.util;

import com.nuriwoolim.pagebackend.domain.board.dto.BoardCreateRequest;
import com.nuriwoolim.pagebackend.domain.board.dto.BoardResponse;
import com.nuriwoolim.pagebackend.domain.board.entity.Board;
import com.nuriwoolim.pagebackend.domain.board.entity.BoardType;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class BoardMapper {

    public static BoardResponse toBoardResponse(Board board) {
        return BoardResponse.builder()
                .id(board.getId()) //board같은 entity에 접근할때는 get필요 (entity는 dto와 달리 private)
                .title(board.getTitle())
                .description(board.getDescription())
                .type(board.getType())
                .build();
    }

    public static Board fromBoardCreateRequest(BoardCreateRequest request) {
        Board.BoardBuilder builder = Board.builder()
                .title(request.title())
                .description(request.description());

        if (request.type() != null) { //기본값 assign
            builder.type(request.type());
        }

        return builder.build();
    } //request 가 response 가 되기 전에는 entity를 거쳐야됨 (db에 저장)

}
