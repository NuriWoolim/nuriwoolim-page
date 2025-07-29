package com.nuriwoolim.pagebackend.domain.user.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
    @NotBlank
    String email,
    @NotBlank
    String password
) {

}
