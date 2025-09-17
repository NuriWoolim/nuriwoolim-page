package com.nuriwoolim.pagebackend.domain.user.util;

import com.nuriwoolim.pagebackend.domain.user.dto.UserResponse;
import com.nuriwoolim.pagebackend.domain.user.dto.UserSignupRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.VerificationResendResponse;
import com.nuriwoolim.pagebackend.domain.user.entity.EmailVerification;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class UserMapper {

    public static User fromUserSignupRequest(final UserSignupRequest userSignupRequest,
        final String encodedPassword) {
        return User.builder()
            .name(userSignupRequest.name())
            .email(userSignupRequest.email())
            .password(encodedPassword)
            .build();
    }

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

    public static EmailVerification toEmailCode(String email, String code, String resendToken) {
        return EmailVerification.builder()
            .email(email)
            .code(code)
            .resendToken(resendToken)
            .build();
    }

    public static VerificationResendResponse toVerificationResendResponse(
        EmailVerification emailVerification) {
        return VerificationResendResponse.builder()
            .resendToken(emailVerification.getResendToken())
            .resendCount(emailVerification.getResendCount())
            .build();
    }
}
