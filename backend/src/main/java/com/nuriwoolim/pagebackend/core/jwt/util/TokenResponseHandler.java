package com.nuriwoolim.pagebackend.core.jwt.util;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;

public class TokenResponseHandler {

    public static void setTokens(HttpServletResponse response, String accessToken,
        String refreshToken) {
        response.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken);

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
            .httpOnly(true)
            .secure(true)
            .path("/api/auth")
            .maxAge(3 * 24 * 60 * 60)
            .sameSite("Lax")
            .build();

        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
    }

    public static void clearTokens(HttpServletResponse response) {
        ResponseCookie deleteCookie = ResponseCookie.from("refreshToken")
            .path("/api/auth")
            .maxAge(0)
            .build();

        response.addHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());
    }
}
