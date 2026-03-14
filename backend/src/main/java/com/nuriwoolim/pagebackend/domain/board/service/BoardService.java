package com.nuriwoolim.pagebackend.domain.board.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nuriwoolim.pagebackend.domain.board.dto.BoardCreateRequest;
import com.nuriwoolim.pagebackend.domain.board.dto.BoardListResponse;
import com.nuriwoolim.pagebackend.domain.board.dto.BoardResponse;
import com.nuriwoolim.pagebackend.domain.board.dto.BoardUpdateRequest;
import com.nuriwoolim.pagebackend.domain.board.entity.Board;
import com.nuriwoolim.pagebackend.domain.board.permission.BoardPermissionContext;
import com.nuriwoolim.pagebackend.domain.board.permission.BoardPermissionEvaluator;
import com.nuriwoolim.pagebackend.domain.board.repository.BoardRepository;
import com.nuriwoolim.pagebackend.domain.board.util.BoardMapper;
import com.nuriwoolim.pagebackend.domain.user.entity.UserType;
import com.nuriwoolim.pagebackend.domain.user.service.UserService;
import com.nuriwoolim.pagebackend.global.exception.ErrorCode;
import com.nuriwoolim.pagebackend.global.permission.dto.PermissionDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BoardService {
	private final BoardRepository boardRepository;
	private final UserService userService;
	private final BoardPermissionEvaluator boardPermissionEvaluator;

	@Transactional
	public BoardResponse create(BoardCreateRequest request, Long actorId) { //actorId는 권한 verify 용도
		validatePermission(actorId); //admin인가?
		if (boardRepository.existsByTitle(request.title())) {
			throw ErrorCode.BOARD_TITLE_CONFLICT.toException();
		}  //이미 있는 title?
		Board board = BoardMapper.fromBoardCreateRequest(request);
		Board savedBoard = boardRepository.save(board); //try-catch 필요없음, GlobalExceptionHandler덕분
		return BoardMapper.toBoardResponse(savedBoard, resolvePermission(savedBoard, actorId));
	}

	@Transactional(readOnly = true)
	public BoardListResponse findBoardList(int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		//paging metadata 보존
		Page<Board> boardPage = boardRepository.findAll(pageable);

		return BoardMapper.toBoardListResponse(boardPage);
	}

	@Transactional(readOnly = true)
	public Board getBoardById(Long boardId) { //service layer에서 쓸 함수 (특히 updateById)
		return boardRepository.findById(boardId).orElseThrow(ErrorCode.DATA_NOT_FOUND::toException);
	}

	@Transactional(readOnly = true)
	public BoardResponse findById(Long boardId, Long actorId) { //controller에서 쓸 함수
		Board board = getBoardById(boardId);
		return BoardMapper.toBoardResponse(board, resolvePermission(board, actorId));
	}

	@Transactional
	public void deleteById(Long boardId, Long actorId) {
		Board board = getBoardById(boardId);
		validatePermission(actorId);
		boardRepository.delete(board);
	}

	@Transactional
	public BoardResponse updateById(Long boardId, BoardUpdateRequest request, Long actorId) {
		validatePermission(actorId);
		Board board = getBoardById(boardId);
		board.update(request);
		return BoardMapper.toBoardResponse(board, resolvePermission(board, actorId));
	}

	private void validatePermission(Long actorId) {
		if (!userService.isAdmin(actorId)) {
			throw ErrorCode.DATA_FORBIDDEN.toException();
		}
	}

	private PermissionDto resolvePermission(Board board, Long actorId) {
		UserType role = userService.getUserTypeById(actorId);
		BoardPermissionContext context = new BoardPermissionContext(board, actorId);
		return boardPermissionEvaluator.evaluate(role, context);
	}
}
