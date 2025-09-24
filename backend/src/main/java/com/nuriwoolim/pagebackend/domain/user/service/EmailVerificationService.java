package com.nuriwoolim.pagebackend.domain.user.service;

import com.nuriwoolim.pagebackend.domain.user.entity.EmailVerification;
import com.nuriwoolim.pagebackend.domain.user.entity.EmailVerificationType;
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
    public void sendVerificationEmail(String email, EmailVerificationType type) {
        String code = CodeGenerator.generateCode();
        Optional<EmailVerification> existingVerification = emailVerificationRepository.findByEmailAndType(
            email, type);

        if (existingVerification.isEmpty()) {
            createNewVerification(email, code, type);
        } else {
            handleExistingVerification(existingVerification.get(), email, code, type);
        }

        processSendEmail(email, code, type);
    }

    private void createNewVerification(String email, String code, EmailVerificationType type) {
        EmailVerification newEmailVerification = UserMapper.toEmailVerification(email, code, type);
        newEmailVerification.setExpiresAt(verificationExpires);
        emailVerificationRepository.save(newEmailVerification);
    }

    private void handleExistingVerification(EmailVerification emailVerification, String email,
        String code, EmailVerificationType type) {
        if (canResendVerification(emailVerification)) {
            updateExistingVerification(emailVerification, code);
        } else {
            validateResendCooldown(emailVerification);
            recreateVerification(email, code, type);
        }
    }

    private boolean canResendVerification(EmailVerification emailVerification) {
        return emailVerification.getSendCount() < resendCount;
    }

    private void updateExistingVerification(EmailVerification emailVerification, String code) {
        emailVerification.countResend(code);
        emailVerification.setExpiresAt(verificationExpires);
    }

    private void validateResendCooldown(EmailVerification emailVerification) {
        LocalDateTime cooldownEndTime = emailVerification.getUpdatedAt().plusSeconds(resendTime);
        if (LocalDateTime.now().isBefore(cooldownEndTime)) {
            throw ErrorCode.TOO_MANY_RESEND.toException("Request After " + cooldownEndTime);
        }
    }

    private void recreateVerification(String email, String code, EmailVerificationType type) {
        emailVerificationRepository.deleteByEmailAndType(email, type);
        emailVerificationRepository.flush();
        createNewVerification(email, code, type);
    }

    private void processSendEmail(String email, String code, EmailVerificationType type) {
        switch (type) {
            case SIGNUP:
                emailService.sendVerificationEmail(email, code);
                break;
            case RESET_PASSWORD:
                emailService.sendPasswordResetEmail(email, code);
                break;
            default:
                throw ErrorCode.BAD_REQUEST.toException();
        }
    }

    @Transactional(readOnly = true)
    public EmailVerification getEmailVerificationByType(String email, EmailVerificationType type) {
        return emailVerificationRepository.findByEmailAndType(email, type).orElseThrow(
            ErrorCode.DATA_NOT_FOUND::toException);
    }

    @Transactional
    public void verifyEmail(String email, String code, EmailVerificationType type) {
        EmailVerification emailVerification = getEmailVerificationByType(email, type);

        if (emailVerification.isExpired()) {
            emailVerificationRepository.deleteByEmail(email);
            throw ErrorCode.EXPIRED_EMAIL_CODE.toException();
        }

        if (!emailVerification.getCode().equals(code)) {
            throw ErrorCode.INVALID_EMAIL_CODE.toException();
        }
    }

    @Transactional
    public void deleteVerification(String email, EmailVerificationType type) {
        emailVerificationRepository.deleteByEmailAndType(email, type);
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
