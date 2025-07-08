package com.nuriwoolim.pagebackend.domain.user.controller;

import com.nuriwoolim.pagebackend.core.jwt.util.TokenResponseHandler;
import com.nuriwoolim.pagebackend.domain.user.dto.LoginDTO;
import com.nuriwoolim.pagebackend.domain.user.dto.LoginRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.TokenPair;
import com.nuriwoolim.pagebackend.domain.user.dto.UserCreateRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.UserResponse;
import com.nuriwoolim.pagebackend.domain.user.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.net.URI;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<UserResponse> signup(
        @Valid @RequestBody UserCreateRequest userCreateRequest) {
        UserResponse response = authService.signUp(userCreateRequest);
        URI location = URI.create("/api/users/" + response.id());
        return ResponseEntity.created(location)
            .body(response);
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
    public ResponseEntity<?> refreshToken(@CookieValue String refreshToken,
        HttpServletResponse response) {

        TokenPair newTokens = authService.refresh(refreshToken);

        // 새 토큰을 쿠키에 설정
        TokenResponseHandler.setTokens(response, newTokens.accessToken(), newTokens.refreshToken());

        return ResponseEntity.ok().build();
    }
}
