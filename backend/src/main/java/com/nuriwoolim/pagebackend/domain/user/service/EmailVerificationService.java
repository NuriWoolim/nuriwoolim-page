package com.nuriwoolim.pagebackend.domain.user.service;

import com.nuriwoolim.pagebackend.core.jwt.util.JwtTokenProvider;
import com.nuriwoolim.pagebackend.domain.user.dto.VerificationResendResponse;
import com.nuriwoolim.pagebackend.domain.user.entity.EmailVerification;
import com.nuriwoolim.pagebackend.domain.user.repository.EmailVerificationRepository;
import com.nuriwoolim.pagebackend.domain.user.util.CodeGenerator;
import com.nuriwoolim.pagebackend.domain.user.util.UserMapper;
import com.nuriwoolim.pagebackend.global.email.service.EmailService;
import com.nuriwoolim.pagebackend.global.exception.ErrorCode;
import io.jsonwebtoken.JwtException;
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
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;
    @Value("${custom.resendLimit}")
    private int resendLimit;

    @Transactional
    public VerificationResendResponse sendVerificationEmail(String email) {
        String code = CodeGenerator.generateCode();
        String resendToken = jwtTokenProvider.issueEmailToken(email);

        if (emailVerificationRepository.existsByEmail(email)) {
            emailVerificationRepository.deleteByEmail(email);
            emailVerificationRepository.flush();
        }

        EmailVerification emailVerification = emailVerificationRepository.save(
            UserMapper.toEmailCode(email, code, resendToken));
        emailService.sendVerificationEmail(email, code);
        return UserMapper.toVerificationResendResponse(emailVerification);
    }

    @Transactional
    public VerificationResendResponse resendVerificationEmail(String resendToken) {
        try {
            jwtTokenProvider.validate(resendToken);
        } catch (JwtException e) {
            throw ErrorCode.INVALID_TOKEN.toException();
        }

        EmailVerification emailVerification = emailVerificationRepository.findByResendToken(
                resendToken)
            .orElseThrow(ErrorCode.USER_NOT_FOUND::toException);

        if (emailVerification.getResendCount() >= resendLimit) {
            throw ErrorCode.TOO_MANY_RESEND.toException();
        }

        String newCode = CodeGenerator.generateCode();
        emailVerification.updateCode(newCode);
        emailVerification.countResend();

        emailService.sendVerificationEmail(emailVerification.getEmail(), newCode);

        return UserMapper.toVerificationResendResponse(emailVerification);
    }

    @Transactional
    public void verifyEmail(String email, String code) {
        Optional<EmailVerification> emailVerification = emailVerificationRepository.findByEmail(
            email);
        if (emailVerification.isEmpty()) {
            throw ErrorCode.DATA_NOT_FOUND.toException();
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
