package com.nuriwoolim.pagebackend.domain.user.dto;

public record LoginDTO(
        UserResponse user,
        TokenPair tokens
) {
}
