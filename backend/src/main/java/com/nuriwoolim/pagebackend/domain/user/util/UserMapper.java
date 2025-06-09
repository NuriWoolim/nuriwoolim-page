package com.nuriwoolim.pagebackend.domain.user.util;

import com.nuriwoolim.pagebackend.domain.user.dto.LoginResponse;
import com.nuriwoolim.pagebackend.domain.user.dto.UserCreateRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.UserResponse;
import com.nuriwoolim.pagebackend.domain.user.entity.User;

public class UserMapper {
    public static UserResponse toUserResponse(final User user) {
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

    public static LoginResponse toLoginResponse(final User user, final String accessToken) {
        return LoginResponse.builder()
                .user(toUserResponse(user))
                .accessToken(accessToken)
                .build();
    }

    public static User fromUserCreateRequest(final UserCreateRequest userCreateRequest, final String encodedPassword) {
        return User.builder()
                .username(userCreateRequest.username())
                .email(userCreateRequest.email())
                .password(encodedPassword)
                .nickname(userCreateRequest.nickname())
                .build();
    }
}
