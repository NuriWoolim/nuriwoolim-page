package com.nuriwoolim.pagebackend.core.jwt.util;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TokenResponseHandler {

    private static String profile;

    private final Environment environment;

    @PostConstruct
    public void init() {
        String[] activeProfiles = environment.getActiveProfiles();
        profile = activeProfiles.length > 0 ? activeProfiles[0] : "dev";
    }

    public static void setTokens(HttpServletResponse response, String accessToken,
        String refreshToken) {
        response.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken);

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
            .httpOnly(true)
            .secure(true)
            .path("/api/auth")
            .maxAge(3 * 24 * 60 * 60)
            .sameSite("None")
            .build();
        if (profile.equals("dev")) {
            refreshCookie = refreshCookie.mutate().httpOnly(false).path("/auth").build();
        }

        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
    }

    public static void clearTokens(HttpServletResponse response) {
        ResponseCookie deleteCookie = ResponseCookie.from("refreshToken")
            .path("/api/auth")
            .maxAge(0)
            .build();

        if (profile.equals("dev")) {
            deleteCookie = deleteCookie.mutate().path("/auth").build();
        }

        response.addHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());
    }
}
