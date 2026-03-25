package com.nuriwoolim.pagebackend.domain.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "이메일 인증 코드 확인 요청")
public record EmailVerifyRequest(
    @Email
    @NotBlank
    @Schema(description = "인증 대상 이메일", example = "member@example.com")
    String email,

    @NotBlank
    @Schema(description = "메일로 전달된 인증 코드", example = "A1B2C3")
    String code
) {
}

