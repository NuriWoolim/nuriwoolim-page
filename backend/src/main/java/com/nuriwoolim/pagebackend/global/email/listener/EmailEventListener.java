package com.nuriwoolim.pagebackend.global.email.listener;

import com.nuriwoolim.pagebackend.global.email.event.PasswordResetEmailEvent;
import com.nuriwoolim.pagebackend.global.email.event.SignupVerificationEmailEvent;
import com.nuriwoolim.pagebackend.global.email.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmailEventListener {

    private final EmailService emailService;

    /**
     * EmailVerification 저장 트랜잭션이 커밋된 후 회원가입 인증 메일을 발송한다.
     * AFTER_COMMIT 단계를 사용하므로 DB 저장 실패 시 메일이 발송되지 않는다.
     */
    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleSignupVerificationEmail(SignupVerificationEmailEvent event) {
        log.debug("handleSignupVerificationEmail: {}", event.email());
        emailService.sendVerificationEmail(event.email(), event.code());
    }

    /**
     * EmailVerification 저장 트랜잭션이 커밋된 후 비밀번호 초기화 인증 메일을 발송한다.
     * AFTER_COMMIT 단계를 사용하므로 DB 저장 실패 시 메일이 발송되지 않는다.
     */
    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handlePasswordResetEmail(PasswordResetEmailEvent event) {
        log.debug("handlePasswordResetEmail: {}", event.email());
        emailService.sendPasswordResetEmail(event.email(), event.code());
    }
}
