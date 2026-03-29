package com.nuriwoolim.pagebackend.domain.post.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nuriwoolim.pagebackend.core.jwt.dto.JwtPrincipal;
import com.nuriwoolim.pagebackend.domain.post.dto.PostCreateRequest;
import com.nuriwoolim.pagebackend.domain.post.dto.PostListResponse;
import com.nuriwoolim.pagebackend.domain.post.dto.PostResponse;
import com.nuriwoolim.pagebackend.domain.post.dto.PostUpdateRequest;
import com.nuriwoolim.pagebackend.domain.post.service.PostService;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/posts")
@Tag(name = "Post", description = "게시글 관리 API")
public class PostController {

	private final PostService postService;

	@PostMapping
	public ResponseEntity<PostResponse> create(
		@Valid @RequestBody PostCreateRequest request,
		@AuthenticationPrincipal JwtPrincipal jwtPrincipal) {

		return ResponseEntity.status(HttpStatus.CREATED)
			.body(postService.create(request.boardId(), request, jwtPrincipal.getId()));
	}

	@GetMapping
	public ResponseEntity<PostListResponse> getPosts(
		@RequestParam Long boardId,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size
	) {
		return ResponseEntity.ok(postService.findPostList(boardId, page, size));
	}

	@GetMapping("/{postId}")
	public ResponseEntity<PostResponse> getById(
		@PathVariable Long postId,
		@AuthenticationPrincipal JwtPrincipal jwtPrincipal) {
		return ResponseEntity.ok(postService.getById(postId, jwtPrincipal.getId()));
	}

	@DeleteMapping("/{postId}")
	public ResponseEntity<Void> delete(
		@PathVariable Long postId,
		@AuthenticationPrincipal JwtPrincipal jwtPrincipal) {
		postService.deleteById(postId, jwtPrincipal.getId());
		return ResponseEntity.noContent().build();
	}

	@PatchMapping("/{postId}")
	public ResponseEntity<PostResponse> update(
		@PathVariable Long postId,
		@Valid @RequestBody PostUpdateRequest request,
		@AuthenticationPrincipal JwtPrincipal jwtPrincipal) {
		return ResponseEntity.ok(postService.updateById(postId, request, jwtPrincipal.getId()));
	}
}
