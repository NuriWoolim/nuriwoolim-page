package com.nuriwoolim.pagebackend.domain.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nuriwoolim.pagebackend.core.jwt.dto.JwtPrincipal;
import com.nuriwoolim.pagebackend.domain.user.dto.ChangePasswordRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.UserResponse;
import com.nuriwoolim.pagebackend.domain.user.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
@Tag(name = "User", description = "사용자 정보 API")
public class UserController {

	private final UserService userService;

	/**
	 * 로그인한 사용자의 비밀번호를 변경한다.
	 *
	 * @param principal 로그인 사용자 정보
	 * @param request 현재 비밀번호/새 비밀번호/새 비밀번호 확인
	 * @return 처리 결과
	 */
	@Operation(summary = "비밀번호 변경", description = "현재 비밀번호를 검증한 뒤 새 비밀번호로 변경합니다.")
	@PatchMapping("/password-change")
	public ResponseEntity<Void> changePassword(@AuthenticationPrincipal JwtPrincipal principal,
		@Valid @RequestBody ChangePasswordRequest request) {
		userService.changePassword(principal.getId(), request);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/me")
	public ResponseEntity<UserResponse> getUser(@AuthenticationPrincipal JwtPrincipal principal) {
		return ResponseEntity.ok(userService.findById(principal.getId()));
	}
}
