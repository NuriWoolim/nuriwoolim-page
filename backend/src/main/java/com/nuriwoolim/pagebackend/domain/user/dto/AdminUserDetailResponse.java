package com.nuriwoolim.pagebackend.domain.user.dto;

import com.nuriwoolim.pagebackend.domain.user.entity.UserType;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record AdminUserDetailResponse(
    Long id,
    String name,
    String email,
    UserType type,
    Integer year,
    String studentNumber,
    String college,
    String major,
    int postCount,
    int commentCount,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
}

