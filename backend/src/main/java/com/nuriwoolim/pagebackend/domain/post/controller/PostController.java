package com.nuriwoolim.pagebackend.domain.post.controller;

import com.nuriwoolim.pagebackend.core.jwt.dto.JwtPrincipal;
import com.nuriwoolim.pagebackend.domain.post.dto.PostCreateRequest;
import com.nuriwoolim.pagebackend.domain.post.dto.PostResponse;
import com.nuriwoolim.pagebackend.domain.post.entity.Post;
import com.nuriwoolim.pagebackend.domain.post.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/boards/{boardId}/posts")
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<PostResponse> create (
            @PathVariable Long boardId,
            @Valid @RequestBody PostCreateRequest request,
            @AuthenticationPrincipal JwtPrincipal jwtPrincipal) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(postService.create(boardId, request, jwtPrincipal.getId()));
    }
}
