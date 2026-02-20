package com.nuriwoolim.pagebackend.domain.post.controller;

import com.nuriwoolim.pagebackend.core.jwt.dto.JwtPrincipal;
import com.nuriwoolim.pagebackend.domain.post.dto.PostCreateRequest;
import com.nuriwoolim.pagebackend.domain.post.dto.PostUpdateRequest;
import com.nuriwoolim.pagebackend.domain.post.dto.PostResponse;
import com.nuriwoolim.pagebackend.domain.post.entity.Post;
import com.nuriwoolim.pagebackend.domain.post.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAll(@PathVariable Long boardId){
        List<PostResponse> posts = postService.getAll(boardId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostResponse> getById(
            @PathVariable Long boardId,
            @PathVariable Long postId){
        return ResponseEntity.ok(postService.getById(boardId, postId));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long boardId,
            @PathVariable Long postId,
            @AuthenticationPrincipal JwtPrincipal jwtPrincipal){
        postService.deleteById(boardId, postId, jwtPrincipal.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{postId}")
    public ResponseEntity<PostResponse> update(
            @PathVariable Long boardId,
            @PathVariable Long postId,
            @Valid @RequestBody PostUpdateRequest request,
            @AuthenticationPrincipal JwtPrincipal jwtPrincipal){
        return ResponseEntity.ok(postService.updateById(boardId, postId, request, jwtPrincipal.getId()));
    }
}
