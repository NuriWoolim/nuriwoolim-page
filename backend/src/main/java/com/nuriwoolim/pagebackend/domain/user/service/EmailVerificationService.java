package com.nuriwoolim.pagebackend.domain.user.service;

import com.nuriwoolim.pagebackend.domain.user.entity.EmailVerification;
import com.nuriwoolim.pagebackend.domain.user.repository.EmailVerificationRepository;
import com.nuriwoolim.pagebackend.domain.user.util.CodeGenerator;
import com.nuriwoolim.pagebackend.domain.user.util.UserMapper;
import com.nuriwoolim.pagebackend.global.email.service.EmailService;
import com.nuriwoolim.pagebackend.global.exception.ErrorCode;
import java.time.LocalDateTime;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailVerificationService {

    private final EmailVerificationRepository emailVerificationRepository;
    private final EmailService emailService;

    @Value("${custom.resendTime}")
    private int resendTime;

    @Value("${custom.resendCount}")
    private int resendCount;

    @Value("${custom.verificationExpires}")
    private int verificationExpires;

    @Transactional
    public void sendSignupEmail(String email) {
        String code = CodeGenerator.generateCode();
        processVerificationEmail(email, code);
        emailService.sendVerificationEmail(email, code);
    }

    @Transactional
    public void sendPasswordResetEmail(String email) {
        String code = CodeGenerator.generateCode();
        processVerificationEmail(email, code);
        emailService.sendPasswordResetEmail(email, code);
    }

    @Transactional
    public void processVerificationEmail(String email, String code) {
        EmailVerification emailVerification = getEmailVerification(email);

        if (emailVerification.getResendCount() < resendCount) {  // 재전송 한도 내면 즉시 수정후 재전송
            emailVerification.resend(code);
            emailVerification.setExpiresAt(resendTime);
        } else {                                                // 재전송 한도 초과시 재전송 쿨타임을 기다려야함
            if (LocalDateTime.now()
                .isBefore(emailVerification.getUpdatedAt().plusSeconds(resendTime))) {
                throw ErrorCode.TOO_MANY_RESEND.toException(
                    "Request After " + emailVerification.getUpdatedAt().plusSeconds(resendTime));
            }
            // 재전송 한도 초과후 쿨타임 이후에 요청시 기존 인증정보는 삭제하고 새로 생성
            emailVerificationRepository.deleteByEmail(email);
            emailVerificationRepository.flush();
            EmailVerification newEmailVerification = UserMapper.toEmailVerification(email, code);
            newEmailVerification.setExpiresAt(verificationExpires);
            emailVerificationRepository.save(newEmailVerification);
        }
    }

    @Transactional(readOnly = true)
    public EmailVerification getEmailVerification(String email) {
        return emailVerificationRepository.findByEmail(email).orElseThrow(
            ErrorCode.DATA_NOT_FOUND::toException);
    }

    @Transactional
    public void verifyEmail(String email, String code) {
        Optional<EmailVerification> emailVerification = emailVerificationRepository.findByEmail(
            email);
        if (emailVerification.isEmpty()) {
            throw ErrorCode.DATA_NOT_FOUND.toException("인증 정보가 없습니다.");
        }

        EmailVerification verification = emailVerification.get();

        if (verification.isExpired()) {
            emailVerificationRepository.deleteByEmail(email);
            throw ErrorCode.EXPIRED_EMAIL_CODE.toException();
        }

        if (!verification.getCode().equals(code)) {
            throw ErrorCode.INVALID_EMAIL_CODE.toException();
        }
    }

    @Transactional
    public void deleteVerification(String email) {
        emailVerificationRepository.deleteByEmail(email);
    }

//    @Scheduled(fixedRate = 300000) // 5분마다 실행
//    @Transactional
//    public void cleanupExpiredVerifications() {
//        int deletedCount = emailVerificationRepository.deleteByExpiresAtBefore(LocalDateTime.now());
//
//        if (deletedCount > 0) {
//            log.info("Delete Expired Verification {} Data", deletedCount);
//        }
//    }

    /**
     * 매일 자정에 만료된 인증데이터 제거
     */
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void dailyCleanup() {
        int deletedCount = emailVerificationRepository.deleteByExpiresAtBefore(LocalDateTime.now());
        log.info("Daily: Delete Expired Verification {} Data", deletedCount);
    }

}
