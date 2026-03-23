package com.nuriwoolim.pagebackend.domain.user.dto;

import com.nuriwoolim.pagebackend.domain.user.entity.UserType;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record AdminUserSummaryResponse(
    Long id,
    String name,
    String email,
    UserType type,
    Integer year,
    LocalDateTime createdAt
) {
}

