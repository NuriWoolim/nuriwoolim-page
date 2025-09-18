package com.nuriwoolim.pagebackend.domain.user.controller;

import com.nuriwoolim.pagebackend.core.jwt.util.TokenResponseHandler;
import com.nuriwoolim.pagebackend.domain.user.dto.LoginDTO;
import com.nuriwoolim.pagebackend.domain.user.dto.LoginRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.PasswordResetRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.TokenPair;
import com.nuriwoolim.pagebackend.domain.user.dto.UserResponse;
import com.nuriwoolim.pagebackend.domain.user.dto.UserSignupRequest;
import com.nuriwoolim.pagebackend.domain.user.service.AuthService;
import com.nuriwoolim.pagebackend.domain.user.service.EmailVerificationService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@Validated
public class AuthController {

    private final AuthService authService;
    private final EmailVerificationService emailVerificationService;

    @PostMapping("/signup")
    public ResponseEntity<Void> signup(
        @Valid @RequestBody UserSignupRequest userSignupRequest) {
        authService.signUp(userSignupRequest);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/check-email")
    public ResponseEntity<Void> checkEmail(@RequestParam @Email String email) {
        authService.checkEmail(email);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody LoginRequest loginRequest,
        HttpServletResponse response) {
        LoginDTO data = authService.login(loginRequest);

        TokenResponseHandler.setTokens(response, data.tokens().accessToken(),
            data.tokens().refreshToken());

        return ResponseEntity.ok(data.user());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response,
        @CookieValue String refreshToken) {

        authService.logout(refreshToken);
        TokenResponseHandler.clearTokens(response);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<Void> refreshToken(@CookieValue String refreshToken,
        HttpServletResponse response) {

        TokenPair newTokens = authService.refresh(refreshToken);

        // 새 토큰을 쿠키에 설정
        TokenResponseHandler.setTokens(response, newTokens.accessToken(), newTokens.refreshToken());

        return ResponseEntity.ok().build();
    }

    @GetMapping("/verify-email")
    public ResponseEntity<Void> verifyEmail(@RequestParam String email, @RequestParam String code) {
        emailVerificationService.verifyEmail(email, code);

        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/send-verification")
    public ResponseEntity<Void> sendVerification(@RequestParam String email) {
        emailVerificationService.sendVerificationEmail(email);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestBody @Valid PasswordResetRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.status(HttpStatus.OK).build();
    }


}
