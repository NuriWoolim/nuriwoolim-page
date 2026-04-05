package com.nuriwoolim.pagebackend.domain.user.util;

import com.nuriwoolim.pagebackend.domain.user.dto.MyPageResponse;
import com.nuriwoolim.pagebackend.domain.user.dto.UserResponse;
import com.nuriwoolim.pagebackend.domain.user.dto.UserSignupRequest;
import com.nuriwoolim.pagebackend.domain.user.entity.EmailVerification;
import com.nuriwoolim.pagebackend.domain.user.entity.EmailVerificationType;
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
            .studentNumber(userSignupRequest.studentNumber())
            .college(userSignupRequest.college())
            .major(userSignupRequest.major())
            .build();
    }

    public static UserResponse toUserResponse(final User user) {
        return UserResponse.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .type(user.getType())
            .year(user.getYear())
            .studentNumber(user.getStudentNumber())
            .college(user.getCollege())
            .major(user.getMajor())
            .createdDate(user.getCreatedAt())
            .build();
    }

    public static MyPageResponse toMyPageResponse(final User user) {
        return MyPageResponse.builder()
            .name(user.getName())
            .email(user.getEmail())
            .type(user.getType())
            .year(user.getYear())
            .studentNumber(user.getStudentNumber())
            .college(user.getCollege())
            .major(user.getMajor())
            .build();
    }

    public static EmailVerification toEmailVerification(String email, String code,
        EmailVerificationType type) {
        return EmailVerification.builder()
            .email(email)
            .code(code)
            .type(type)
            .build();
    }
}
