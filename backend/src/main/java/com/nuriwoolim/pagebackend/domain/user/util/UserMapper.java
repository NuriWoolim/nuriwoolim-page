package com.nuriwoolim.pagebackend.domain.user.util;

import com.nuriwoolim.pagebackend.domain.user.dto.UserResponse;
import com.nuriwoolim.pagebackend.domain.user.dto.UserSignupRequest;
import com.nuriwoolim.pagebackend.domain.user.entity.User;

public class UserMapper {

    public static UserResponse toUserResponse(final User user) {
        return UserResponse.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .type(user.getType())
            .year(user.getYear())
            .createdDate(user.getCreatedAt())
            .build();
    }

    public static User fromUserCreateRequest(final UserSignupRequest userSignupRequest,
        final String encodedPassword) {
        return User.builder()
            .name(userSignupRequest.name())
            .email(userSignupRequest.email())
            .password(encodedPassword)
            .build();
    }
}
