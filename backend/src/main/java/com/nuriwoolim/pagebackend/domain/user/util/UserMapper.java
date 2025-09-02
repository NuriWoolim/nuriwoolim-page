package com.nuriwoolim.pagebackend.domain.user.util;

import com.nuriwoolim.pagebackend.domain.user.dto.UserResponse;
import com.nuriwoolim.pagebackend.domain.user.dto.UserSignupRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.VerificationResendResponse;
import com.nuriwoolim.pagebackend.domain.user.entity.PendingUser;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
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
        final String encodedPassword, String token, String resendToken) {
        return PendingUser.builder()
            .name(userSignupRequest.name())
            .email(userSignupRequest.email())
            .password(encodedPassword)
            .token(token)
            .resendToken(resendToken)
            .build();
    }

    public static User fromPendingUser(final PendingUser pendingUser) {
        return User.builder()
            .name(pendingUser.getName())
            .email(pendingUser.getEmail())
            .password(pendingUser.getPassword())
            .build();
    }

    public static VerificationResendResponse toVerificationResendResponse(
        final PendingUser pendingUser) {
        return VerificationResendResponse.builder()
            .resendToken(pendingUser.getResendToken())
            .resendCount(pendingUser.getResendCount())
            .build();
    }
}
