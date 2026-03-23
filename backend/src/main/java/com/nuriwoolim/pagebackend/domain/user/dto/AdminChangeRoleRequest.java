package com.nuriwoolim.pagebackend.domain.user.dto;

import com.nuriwoolim.pagebackend.domain.user.entity.UserType;
import jakarta.validation.constraints.NotNull;

public record AdminChangeRoleRequest(
    @NotNull(message = "변경할 역할을 입력해주세요.")
    UserType type
) {
}

