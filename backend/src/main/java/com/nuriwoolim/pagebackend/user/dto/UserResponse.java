package com.nuriwoolim.pagebackend.user.dto;

import com.nuriwoolim.pagebackend.user.User;
import com.nuriwoolim.pagebackend.user.UserType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String nickname;
    private UserType type;
    private Integer year;
    private LocalDate createdDate;
    private boolean emailVerified;

    public static UserResponse of(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .type(user.getType())
                .year(user.getYear())
                .createdDate(user.getCreatedDate())
                .build();
    }
}
