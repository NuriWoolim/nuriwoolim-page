package com.nuriwoolim.pagebackend.domain.user.dto;

import lombok.Builder;

@Builder
public record LoginResponse(
        UserResponse user,
        String accessToken
) {
}
