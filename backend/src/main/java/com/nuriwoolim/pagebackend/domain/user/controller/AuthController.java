package com.nuriwoolim.pagebackend.domain.user.controller;

import com.nuriwoolim.pagebackend.domain.user.dto.LoginDTO;
import com.nuriwoolim.pagebackend.domain.user.dto.LoginRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.UserCreateRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.UserResponse;
import com.nuriwoolim.pagebackend.domain.user.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.net.URI;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<UserResponse> signup(@Valid @RequestBody UserCreateRequest userCreateRequest) {
        UserResponse response = authService.signUp(userCreateRequest);
        URI location = URI.create("/api/users/" + response.id());
        return ResponseEntity.created(location)
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody LoginRequest loginRequest,
                                              HttpServletResponse response) {
        LoginDTO data = authService.login(loginRequest);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(data.tokens().accessToken());

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", data.tokens().refreshToken())
                .httpOnly(true)
                .secure(true)
                .path("/api")
                .maxAge(3 * 24 * 60 * 60) //3일
                .sameSite("Strict")
                .build();
        
        headers.add(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return ResponseEntity.ok().headers(headers).body(data.user());
    }

}
