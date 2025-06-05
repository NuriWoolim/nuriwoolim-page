package com.nuriwoolim.pagebackend.domain.user.dto;

import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.domain.user.entity.UserType;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record UserResponse(
        Long id,
        String username,
        String email,
        String nickname,
        UserType type,
        Integer year,
        LocalDateTime createdDate,
        boolean emailVerified
) {
    public static UserResponse of(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .type(user.getType())
                .year(user.getYear())
                .createdDate(user.getCreatedAt())
                .build();
    }
}
