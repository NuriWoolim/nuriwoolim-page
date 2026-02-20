package com.nuriwoolim.pagebackend.domain.board.controller;


import com.nuriwoolim.pagebackend.core.jwt.dto.JwtPrincipal;
import com.nuriwoolim.pagebackend.domain.board.dto.BoardCreateRequest;
import com.nuriwoolim.pagebackend.domain.board.dto.BoardListResponse;
import com.nuriwoolim.pagebackend.domain.board.dto.BoardUpdateRequest;
import com.nuriwoolim.pagebackend.domain.board.dto.BoardResponse;
import com.nuriwoolim.pagebackend.domain.board.service.BoardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/boards")
public class BoardController {

    private final BoardService boardService;

    @PostMapping
    public ResponseEntity<BoardResponse> create(
            @Valid @RequestBody BoardCreateRequest request,
            @AuthenticationPrincipal JwtPrincipal jwtPrincipal){
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(boardService.create(request, jwtPrincipal.getId()));
    }

    @GetMapping
    public ResponseEntity<BoardListResponse> getBoards(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){ //Q: 운영진만 볼 수 있는 개시판도 필요한가?
        return ResponseEntity.ok(boardService.findBoardList(page, size)); //entity 대신 dto를 return 할것 (encapsulation)
    }

    @GetMapping("/{boardId}")
    public ResponseEntity<BoardResponse> getById(@PathVariable Long boardId){
        return ResponseEntity.ok(boardService.findById(boardId));
    }

    @DeleteMapping("/{boardId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long boardId,
            @AuthenticationPrincipal JwtPrincipal jwtPrincipal){
        boardService.deleteById(boardId, jwtPrincipal.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{boardId}")
    public ResponseEntity<BoardResponse> update(
            @PathVariable Long boardId,
            @Valid @RequestBody BoardUpdateRequest request,
            @AuthenticationPrincipal JwtPrincipal jwtPrincipal){
        return ResponseEntity.ok(boardService.updateById(boardId, request, jwtPrincipal.getId()));
    }
}
