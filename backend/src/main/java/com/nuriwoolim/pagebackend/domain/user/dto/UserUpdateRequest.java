package com.nuriwoolim.pagebackend.domain.user.dto;

import com.nuriwoolim.pagebackend.domain.user.entity.UserType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record UserUpdateRequest(
        @Email
        @Size(max = 50)
        String email,

        @Pattern(regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z])(?=.*[!@#$%^&*()\\-+=]).{8,20}$"
                , message = "비밀번호는 영문 대,소문자와 숫자, 특수기호가 적어도 1개 이상씩 포함된 8자 ~ 20자의 비밀번호여야 합니다.")
        String password,

        @Pattern(regexp = "^[가-힣a-zA-Z0-9]{2,10}$", message = "닉네임은 특수문자를 포함하지 않은 2~10자리여야 합니다.")
        String nickname,

        UserType type,

        Integer year,

        boolean email_verified
) {
}
