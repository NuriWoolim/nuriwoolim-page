package com.nuriwoolim.pagebackend.domain.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "이메일 요청")
public record EmailRequest(
    @Email
    @NotBlank
    @Schema(description = "이메일", example = "member@example.com")
    String email
) {
}

