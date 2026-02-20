package com.nuriwoolim.pagebackend.domain.board.service;

import com.nuriwoolim.pagebackend.domain.board.dto.BoardCreateRequest;
import com.nuriwoolim.pagebackend.domain.board.dto.BoardListResponse;
import com.nuriwoolim.pagebackend.domain.board.dto.BoardResponse;
import com.nuriwoolim.pagebackend.domain.board.dto.BoardUpdateRequest;
import com.nuriwoolim.pagebackend.domain.board.entity.Board;
import com.nuriwoolim.pagebackend.domain.board.repository.BoardRepository;
import com.nuriwoolim.pagebackend.domain.board.util.BoardMapper;
import com.nuriwoolim.pagebackend.domain.user.service.UserService;
import com.nuriwoolim.pagebackend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.nuriwoolim.pagebackend.domain.board.util.BoardMapper.toBoardListResponse;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;
    private final UserService userService;

    @Transactional
    public BoardResponse create(BoardCreateRequest request, Long actorId) { //actorId는 권한 verify 용도
        validatePermission(actorId); //admin인가?
        if (boardRepository.existsByTitle(request.title())){
            throw ErrorCode.BOARD_TITLE_CONFLICT.toException();
        }  //이미 있는 title?
        Board board = BoardMapper.fromBoardCreateRequest(request);
        Board savedBoard = boardRepository.save(board); //try-catch 필요없음, GlobalExceptionHandler덕분
        return BoardMapper.toBoardResponse(savedBoard);
    }

    @Transactional(readOnly = true)
    public BoardListResponse findBoardList(int page, int size){
        Pageable pageable = PageRequest.of(page, size);
        List<Board> boards = boardRepository.findAll(pageable).getContent();

        return toBoardListResponse(boards);
    }

    @Transactional(readOnly = true)
    public Board getById(Long id){ //service layer에서 쓸 함수 (특히 updateById)
        return boardRepository.findById(id).orElseThrow(ErrorCode.DATA_NOT_FOUND::toException);
    }

    @Transactional(readOnly = true)
    public BoardResponse findById(Long id){ //controller에서 쓸 함수
        return BoardMapper.toBoardResponse(getById(id));
    }

    @Transactional
    public void deleteById(Long boardId, Long actorId){
        validatePermission(actorId);
        boardRepository.deleteById(boardId);
    }

    @Transactional
    public BoardResponse updateById(Long boardId, BoardUpdateRequest request, Long actorId){
        validatePermission(actorId);
        Board board = getById(boardId);

        board.update(request);
        return BoardMapper.toBoardResponse(board);
    }

    private void validatePermission(Long actorId) {
        if (!userService.isAdmin(actorId)){
            throw ErrorCode.DATA_FORBIDDEN.toException();
        }
    }
}
