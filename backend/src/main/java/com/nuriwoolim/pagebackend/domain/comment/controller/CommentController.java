package com.nuriwoolim.pagebackend.domain.comment.controller;

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
import com.nuriwoolim.pagebackend.domain.comment.dto.CommentCreateRequest;
import com.nuriwoolim.pagebackend.domain.comment.dto.CommentListResponse;
import com.nuriwoolim.pagebackend.domain.comment.dto.CommentResponse;
import com.nuriwoolim.pagebackend.domain.comment.dto.CommentUpdateRequest;
import com.nuriwoolim.pagebackend.domain.comment.service.CommentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/comments")
public class CommentController {

	private final CommentService commentService;

	@PostMapping
	public ResponseEntity<CommentResponse> create(
		@Valid @RequestBody CommentCreateRequest request,
		@AuthenticationPrincipal JwtPrincipal jwtPrincipal) {
		return ResponseEntity.status(HttpStatus.CREATED)
			.body(commentService.create(request.postId(), request, jwtPrincipal.getId()));
	}

	@GetMapping
	public ResponseEntity<CommentListResponse> getComments(
		@RequestParam Long postId,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "20") int size
	) {
		return ResponseEntity.ok(commentService.findCommentList(postId, page, size));
	}

	@GetMapping("/{commentId}")
	public ResponseEntity<CommentResponse> getById(@PathVariable Long commentId) {
		return ResponseEntity.ok(commentService.getById(commentId));
	}

	@DeleteMapping("/{commentId}")
	public ResponseEntity<Void> delete(
		@PathVariable Long commentId,
		@AuthenticationPrincipal JwtPrincipal jwtPrincipal) {
		commentService.deleteById(commentId, jwtPrincipal.getId());
		return ResponseEntity.noContent().build();
	}

	@PatchMapping("/{commentId}")
	public ResponseEntity<CommentResponse> update(
		@PathVariable Long commentId,
		@Valid @RequestBody CommentUpdateRequest request,
		@AuthenticationPrincipal JwtPrincipal jwtPrincipal) {
		return ResponseEntity.ok(commentService.updateById(commentId, request, jwtPrincipal.getId()));
	}
}

