package com.nuriwoolim.pagebackend.domain.board.util;

import java.util.List;

import org.springframework.data.domain.Page;

import com.nuriwoolim.pagebackend.domain.board.dto.BoardCreateRequest;
import com.nuriwoolim.pagebackend.domain.board.dto.BoardListResponse;
import com.nuriwoolim.pagebackend.domain.board.dto.BoardPreviewResponse;
import com.nuriwoolim.pagebackend.domain.board.dto.BoardResponse;
import com.nuriwoolim.pagebackend.domain.board.entity.Board;
import com.nuriwoolim.pagebackend.global.permission.dto.PermissionDto;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class BoardMapper {

	public static BoardResponse toBoardResponse(Board board, PermissionDto permission) {
		return BoardResponse.builder()
			.id(board.getId()) //board같은 entity에 접근할때는 get필요 (entity는 dto와 달리 private)
			.title(board.getTitle())
			.description(board.getDescription())
			.type(board.getType())
			.permission(permission)
			.build();
	}

	public static Board fromBoardCreateRequest(BoardCreateRequest request) {
		return Board.builder()
			.title(request.title())
			.description(request.description())
			.type(request.type())
			.build();
	} //request 가 response 가 되기 전에는 entity를 거쳐야됨 (db에 저장)

	public static BoardPreviewResponse toBoardPreviewResponse(Board board) {
		return BoardPreviewResponse.builder()
			.id(board.getId())
			.title(board.getTitle())
			.description(board.getDescription())
			.type(board.getType())
			.build();
	}

	public static BoardListResponse toBoardListResponse(Page<Board> boardPage) {
		List<BoardPreviewResponse> data = boardPage.getContent().stream()
			.map(BoardMapper::toBoardPreviewResponse)
			.toList();

		return BoardListResponse.builder()
			.data(data)
			.totalElements(boardPage.getTotalElements())
			.totalPages(boardPage.getTotalPages())
			.currentPage(boardPage.getNumber())
			.build();
	}

}
