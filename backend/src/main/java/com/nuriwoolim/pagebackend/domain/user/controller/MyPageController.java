package com.nuriwoolim.pagebackend.domain.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nuriwoolim.pagebackend.core.jwt.dto.JwtPrincipal;
import com.nuriwoolim.pagebackend.domain.comment.dto.CommentListResponse;
import com.nuriwoolim.pagebackend.domain.comment.service.CommentService;
import com.nuriwoolim.pagebackend.domain.post.dto.PostListResponse;
import com.nuriwoolim.pagebackend.domain.post.service.PostService;
import com.nuriwoolim.pagebackend.domain.user.dto.ChangeNameRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.ChangePasswordRequest;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.domain.user.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mypage")
@Tag(name = "MyPage", description = "마이페이지 관리 API")
public class MyPageController {
	private final PostService postService;
	private final CommentService commentService;
	private final UserService userService;

	@Operation(summary = "내 게시글 조회", description = "내가 작성한 게시글 목록을 페이징으로 조회합니다.")
	@GetMapping("/posts")
	public ResponseEntity<PostListResponse> getMyPosts(
		@AuthenticationPrincipal JwtPrincipal principal,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size) {
		return ResponseEntity.ok(postService.findPostsByWriterId(principal.getId(), page, size));
	}

	@Operation(summary = "내 댓글 조회", description = "내가 작성한 댓글 목록을 페이징으로 조회합니다.")
	@GetMapping("/comments")
	public ResponseEntity<CommentListResponse> getMyComments(
		@AuthenticationPrincipal JwtPrincipal principal,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "20") int size) {
		return ResponseEntity.ok(commentService.findCommentsByWriterId(principal.getId(), page, size));
	}

	@Operation(summary = "내 이메일 조회", description = "내 이메일을 조회합니다.")
	@GetMapping("/email")
	public ResponseEntity<String> getMyEmail(@AuthenticationPrincipal JwtPrincipal principal) {
		User user = userService.getUserById(principal.getId());
		return ResponseEntity.ok(user.getEmail());
	}

	@Operation(summary = "내 이름 조회", description = "내 이름을 조회합니다.")
	@GetMapping("/name")
	public ResponseEntity<String> getMyName(@AuthenticationPrincipal JwtPrincipal principal) {
		User user = userService.getUserById(principal.getId());
		return ResponseEntity.ok(user.getName());
	}

	@Operation(summary = "이름 변경", description = "내 이름을 변경합니다.")
	@PatchMapping("/name")
	public ResponseEntity<Void> changeName(
		@AuthenticationPrincipal JwtPrincipal principal,
		@Valid @RequestBody ChangeNameRequest request) {
		userService.changeName(principal.getId(), request);
		return ResponseEntity.ok().build();
	}

	@Operation(summary = "비밀번호 변경", description = "현재 비밀번호를 검증한 뒤 새 비밀번호로 변경합니다.")
	@PatchMapping("/password")
	public ResponseEntity<Void> changePassword(
		@AuthenticationPrincipal JwtPrincipal principal,
		@Valid @RequestBody ChangePasswordRequest request) {
		userService.changePassword(principal.getId(), request);
		return ResponseEntity.ok().build();
	}
}
