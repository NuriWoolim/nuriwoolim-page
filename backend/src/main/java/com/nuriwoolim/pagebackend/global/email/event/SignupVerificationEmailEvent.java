package com.nuriwoolim.pagebackend.global.email.event;

/**
 * 회원가입 이메일 인증 코드 발송 이벤트.
 * EmailVerification 저장 트랜잭션이 커밋된 후 발송된다.
 */
public record SignupVerificationEmailEvent(String email, String code) {
}

