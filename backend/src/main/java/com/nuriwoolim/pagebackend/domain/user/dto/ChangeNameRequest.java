package com.nuriwoolim.pagebackend.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangeNameRequest(
	@NotBlank
	@Size(min = 1, max = 20, message = "이름은 1자 ~ 20자여야 합니다.")
	String name
) {
}

