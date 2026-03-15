package com.nuriwoolim.pagebackend.domain.user.controller;

import com.nuriwoolim.pagebackend.core.jwt.util.TokenResponseHandler;
import com.nuriwoolim.pagebackend.domain.user.dto.EmailRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.EmailVerifyRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.LoginDTO;
import com.nuriwoolim.pagebackend.domain.user.dto.LoginRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.PasswordResetRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.PasswordResetResponse;
import com.nuriwoolim.pagebackend.domain.user.dto.TokenPair;
import com.nuriwoolim.pagebackend.domain.user.dto.UserResponse;
import com.nuriwoolim.pagebackend.domain.user.dto.UserSignupRequest;
import com.nuriwoolim.pagebackend.domain.user.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@Tag(name = "Auth", description = "인증 및 계정 보안 API")
public class AuthController {

    private final AuthService authService;

    /**
     * 회원가입을 처리한다.
     *
     * @param userSignupRequest 이름/이메일/비밀번호/인증코드를 포함한 회원가입 요청
     * @return 처리 결과
     */
    @Operation(summary = "회원가입", description = "이메일 인증이 완료된 코드로 신규 사용자를 등록합니다.")
    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@Valid @RequestBody UserSignupRequest userSignupRequest) {
        authService.signUp(userSignupRequest);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    /**
     * 이메일 중복 여부를 확인한다.
     *
     * @param request 확인할 이메일 요청
     * @return 처리 결과
     */
    @Operation(summary = "이메일 중복 확인", description = "회원가입 가능 여부를 위해 이메일 사용 여부를 확인합니다.")
    @PostMapping("/check-email")
    public ResponseEntity<Void> checkEmail(@Valid @RequestBody EmailRequest request) {
        authService.checkEmail(request.email());
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    /**
     * 회원가입용 인증 메일을 발송한다.
     *
     * @param request 인증 코드를 받을 이메일 요청
     * @return 처리 결과
     */
    @Operation(summary = "회원가입 인증 메일 전송", description = "회원가입 절차에 사용할 이메일 인증 코드를 발송합니다.")
    @PostMapping("/signup/send-verification")
    public ResponseEntity<Void> sendSignupVerification(@Valid @RequestBody EmailRequest request) {
        authService.sendSignupVerification(request.email());
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    /**
     * 회원가입용 인증 코드를 검증한다.
     *
     * @param request 인증 대상 이메일과 인증 코드 요청
     * @return 처리 결과
     */
    @Operation(summary = "회원가입 이메일 인증", description = "회원가입용으로 발송된 인증 코드를 검증하고 가입 가능 상태로 전환합니다.")
    @PostMapping("/signup/verify-email")
    public ResponseEntity<Void> verifySignupEmail(@Valid @RequestBody EmailVerifyRequest request) {
        authService.verifySignupEmail(request.email(), request.code());
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    /**
     * 비밀번호 초기화용 인증 메일을 발송한다.
     *
     * @param request 인증 코드를 받을 이메일 요청
     * @return 처리 결과
     */
    @Operation(summary = "비밀번호 초기화 인증 메일 전송", description = "비밀번호 초기화에 사용할 이메일 인증 코드를 발송합니다.")
    @PostMapping("/password-reset/send-verification")
    public ResponseEntity<Void> sendPasswordResetVerification(@Valid @RequestBody EmailRequest request) {
        authService.sendPasswordResetVerification(request.email());
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    /**
     * 로그인 처리 후 토큰 쿠키를 발급한다.
     *
     * @param loginRequest 이메일/비밀번호 로그인 요청
     * @param response 응답 객체
     * @return 사용자 정보
     */
    @Operation(summary = "로그인", description = "로그인을 수행하고 액세스 토큰과 리프레시 토큰을 쿠키에 설정합니다.")
    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody LoginRequest loginRequest,
        HttpServletResponse response) {
        LoginDTO data = authService.login(loginRequest);

        TokenResponseHandler.setTokens(response, data.tokens().accessToken(),
            data.tokens().refreshToken());

        return ResponseEntity.ok(data.user());
    }

    /**
     * 로그아웃 처리 후 토큰 쿠키를 제거한다.
     *
     * @param response 응답 객체
     * @param refreshToken 리프레시 토큰
     * @return 처리 결과
     */
    @Operation(summary = "로그아웃", description = "리프레시 토큰을 무효화하고 인증 쿠키를 제거합니다.")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response,
        @CookieValue String refreshToken) {

        authService.logout(refreshToken);
        TokenResponseHandler.clearTokens(response);

        return ResponseEntity.noContent().build();
    }

    /**
     * 리프레시 토큰으로 새 토큰 쌍을 발급한다.
     *
     * @param refreshToken 리프레시 토큰
     * @param response 응답 객체
     * @return 처리 결과
     */
    @Operation(summary = "토큰 재발급", description = "유효한 리프레시 토큰으로 새로운 토큰을 발급하고 쿠키를 갱신합니다.")
    @PostMapping("/refresh")
    public ResponseEntity<Void> refreshToken(@CookieValue String refreshToken,
        HttpServletResponse response) {

        TokenPair newTokens = authService.refresh(refreshToken);

        TokenResponseHandler.setTokens(response, newTokens.accessToken(), newTokens.refreshToken());

        return ResponseEntity.ok().build();
    }

    /**
     * 비밀번호를 임시 비밀번호로 초기화한다.
     *
     * @param request 이메일과 인증코드를 포함한 초기화 요청
     * @return 임시 비밀번호 응답
     */
    @Operation(summary = "비밀번호 초기화", description = "인증 코드를 검증한 뒤 비밀번호를 임시 비밀번호로 초기화합니다.")
    @PostMapping("/reset-password")
    public ResponseEntity<PasswordResetResponse> resetPassword(
        @RequestBody @Valid PasswordResetRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request));
    }
}
