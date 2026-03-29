package com.nuriwoolim.pagebackend.domain.user.util;

import java.security.SecureRandom;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class CodeGenerator {

    private static final SecureRandom random = new SecureRandom();
    private static final String ALPHANUMERIC = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // 5자리 숫자+문자 코드 생성
    public static String generateCode() {
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < 5; i++) {
            code.append(ALPHANUMERIC.charAt(random.nextInt(ALPHANUMERIC.length())));
        }
        return code.toString();
    }

    public static String generateTemporaryPassword() {
        StringBuilder tempPassword = new StringBuilder();

        // 비밀번호 정책(영문+숫자 포함)을 만족하도록 최소 1개씩 강제 포함
        tempPassword.append((char) ('A' + random.nextInt(26)));
        tempPassword.append((char) ('0' + random.nextInt(10)));

        for (int i = 0; i < 10; i++) {
            tempPassword.append(ALPHANUMERIC.charAt(random.nextInt(ALPHANUMERIC.length())));
        }

        return tempPassword.toString();
    }
}
