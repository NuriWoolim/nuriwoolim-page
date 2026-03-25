package com.nuriwoolim.pagebackend.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ChangePasswordRequest(
    @NotBlank
    String currentPassword,

    @NotBlank
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[A-Za-z]).{8,20}$",
        message = "비밀번호는 숫자와 영문이 포함된 8자 ~ 20자의 비밀번호여야 합니다.")
    String newPassword,

    @NotBlank
    String newPasswordConfirm
) {
}

