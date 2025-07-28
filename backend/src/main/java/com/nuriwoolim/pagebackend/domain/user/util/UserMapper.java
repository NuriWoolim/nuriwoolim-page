package com.nuriwoolim.pagebackend.domain.user.util;

import com.nuriwoolim.pagebackend.domain.user.dto.UserResponse;
import com.nuriwoolim.pagebackend.domain.user.dto.UserSignupRequest;
import com.nuriwoolim.pagebackend.domain.user.entity.PendingUser;
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

    public static PendingUser fromUserCreateRequest(final UserSignupRequest userSignupRequest,
        final String encodedPassword, String token) {
        return PendingUser.builder()
            .name(userSignupRequest.name())
            .email(userSignupRequest.email())
            .password(encodedPassword)
            .token(token)
            .build();
    }

    public static User fromPendingUser(final PendingUser pendingUser) {
        return User.builder()
            .name(pendingUser.getName())
            .email(pendingUser.getEmail())
            .password(pendingUser.getPassword())
            .build();
    }
}
