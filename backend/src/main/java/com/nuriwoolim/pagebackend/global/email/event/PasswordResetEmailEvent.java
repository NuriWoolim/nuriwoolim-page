package com.nuriwoolim.pagebackend.global.email.event;

/**
 * 비밀번호 초기화 이메일 인증 코드 발송 이벤트.
 * EmailVerification 저장 트랜잭션이 커밋된 후 발송된다.
 */
public record PasswordResetEmailEvent(String email, String code) {
}

