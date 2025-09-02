package com.nuriwoolim.pagebackend.domain.user.dto;

public record TokenPair(
        String accessToken,
        String refreshToken
) {
}
