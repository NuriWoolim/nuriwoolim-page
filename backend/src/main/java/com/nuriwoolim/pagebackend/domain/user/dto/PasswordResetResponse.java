package com.nuriwoolim.pagebackend.domain.user.dto;

import lombok.Builder;

@Builder
public record PasswordResetResponse(
    String temporaryPassword
) {
}

