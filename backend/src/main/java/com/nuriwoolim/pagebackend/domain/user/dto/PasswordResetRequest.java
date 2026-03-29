package com.nuriwoolim.pagebackend.domain.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record PasswordResetRequest(
    @Email
    @NotBlank
    String email,


    @NotBlank
    String code) {

}
