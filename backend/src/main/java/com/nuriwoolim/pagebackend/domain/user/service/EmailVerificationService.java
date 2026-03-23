package com.nuriwoolim.pagebackend.domain.user.service;

import java.time.LocalDateTime;
import java.util.EnumSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nuriwoolim.pagebackend.domain.user.entity.EmailVerification;
import com.nuriwoolim.pagebackend.domain.user.entity.EmailVerificationType;
import com.nuriwoolim.pagebackend.domain.user.repository.EmailVerificationRepository;
import com.nuriwoolim.pagebackend.domain.user.util.CodeGenerator;
import com.nuriwoolim.pagebackend.domain.user.util.UserMapper;
import com.nuriwoolim.pagebackend.global.email.event.PasswordResetEmailEvent;
import com.nuriwoolim.pagebackend.global.email.event.SignupVerificationEmailEvent;
import com.nuriwoolim.pagebackend.domain.user.exception.UserErrorCode;
import com.nuriwoolim.pagebackend.global.exception.GlobalErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailVerificationService {

	private static final Set<EmailVerificationType> SIGNUP_TYPES = EnumSet.of(
		EmailVerificationType.SIGNUP,
		EmailVerificationType.SIGNUP_VERIFIED);

	private final EmailVerificationRepository emailVerificationRepository;
	private final ApplicationEventPublisher eventPublisher;

	@Value("${custom.resendTime}")
	private int resendTime;

	@Value("${custom.verificationExpires}")
	private int verificationExpires;

	/**
	 * 회원가입용 인증 메일을 전송한다.
	 *
	 * @param email 인증 코드를 받을 이메일
	 */
	@Transactional
	public void sendSignupVerificationEmail(String email) {
		// 회원가입용 인증 정보는 SIGNUP/SIGNUP_VERIFIED 중 하나만 유지한다.
		Optional<EmailVerification> existingVerification = emailVerificationRepository.findByEmailAndTypeIn(
			email,
			SIGNUP_TYPES);

		validateResendCooldown(existingVerification);
		emailVerificationRepository.deleteByEmailAndTypeIn(email, SIGNUP_TYPES);

		String code = CodeGenerator.generateCode();
		createNewVerification(email, code, EmailVerificationType.SIGNUP);
		eventPublisher.publishEvent(new SignupVerificationEmailEvent(email, code));
	}

	/**
	 * 비밀번호 초기화용 인증 메일을 전송한다.
	 *
	 * @param email 인증 코드를 받을 이메일
	 */
	@Transactional
	public void sendPasswordResetVerificationEmail(String email) {
		// 비밀번호 초기화용 인증 정보는 이메일당 하나만 유지한다.
		Optional<EmailVerification> existingVerification = emailVerificationRepository.findByEmailAndType(
			email,
			EmailVerificationType.PASSWORD_RESET);

		validateResendCooldown(existingVerification);
		emailVerificationRepository.deleteByEmailAndType(email, EmailVerificationType.PASSWORD_RESET);

		String code = CodeGenerator.generateCode();
		createNewVerification(email, code, EmailVerificationType.PASSWORD_RESET);
		eventPublisher.publishEvent(new PasswordResetEmailEvent(email, code));
	}

	/**
	 * 인증 엔티티를 생성해 저장한다.
	 *
	 * @param email 이메일
	 * @param code 인증 코드
	 * @param type 인증 타입
	 */
	private void createNewVerification(String email, String code, EmailVerificationType type) {
		EmailVerification newEmailVerification = UserMapper.toEmailVerification(email, code, type);
		newEmailVerification.setExpiresAt(verificationExpires);
		emailVerificationRepository.save(newEmailVerification);
	}

	/**
	 * 기존 인증 데이터의 마지막 갱신 시간을 기준으로 재전송 쿨다운을 검증한다.
	 *
	 * @param existingVerification 기존 인증 데이터
	 */
	private void validateResendCooldown(Optional<EmailVerification> existingVerification) {
		if (existingVerification.isEmpty()) {
			return;
		}

		LocalDateTime cooldownEndTime = existingVerification.get().getUpdatedAt().plusSeconds(resendTime);
		if (LocalDateTime.now().isBefore(cooldownEndTime)) {
			throw UserErrorCode.TOO_MANY_RESEND.toException("Request After " + cooldownEndTime);
		}
	}

	/**
	 * 회원가입용으로 발급된 인증 코드를 검증하고 검증 완료 상태로 전환한다.
	 *
	 * @param email 인증 대상 이메일
	 * @param code 인증 코드
	 */
	@Transactional
	public void verifySignupEmail(String email, String code) {
		EmailVerification emailVerification = emailVerificationRepository.findByEmailAndType(
			email,
			EmailVerificationType.SIGNUP
		).orElseThrow(GlobalErrorCode.DATA_NOT_FOUND::toException);

		if (emailVerification.isExpired()) {
			emailVerificationRepository.deleteByEmailAndTypeIn(email, SIGNUP_TYPES);
			throw UserErrorCode.EXPIRED_EMAIL_CODE.toException();
		}

		if (!emailVerification.getCode().equals(code)) {
			throw UserErrorCode.INVALID_EMAIL_CODE.toException();
		}

		emailVerificationRepository.deleteByEmailAndType(email, EmailVerificationType.SIGNUP_VERIFIED);
		emailVerification.changeType(EmailVerificationType.SIGNUP_VERIFIED);
		emailVerification.setExpiresAt(verificationExpires);
		emailVerificationRepository.save(emailVerification);
	}

	/**
	 * 회원가입 시점에 검증 완료된 인증정보(email+code)가 유효한지 확인한다.
	 *
	 * @param email 가입 이메일
	 * @param code 가입 요청의 인증 코드
	 */
	@Transactional(readOnly = true)
	public void validateSignupVerified(String email, String code) {
		// 회원가입 단계에서는 verify까지 완료된 동일 코드인지 재확인한다.
		EmailVerification emailVerification = emailVerificationRepository.findByEmailAndCodeAndType(
			email,
			code,
			EmailVerificationType.SIGNUP_VERIFIED
		).orElseThrow(() -> UserErrorCode.SIGNUP_NOT_VERIFIED.toException("먼저 이메일 인증을 완료해주세요."));

		if (emailVerification.isExpired()) {
			throw UserErrorCode.EXPIRED_EMAIL_CODE.toException();
		}
	}

	/**
	 * 비밀번호 초기화 코드가 유효한지 검증한다.
	 *
	 * @param email 인증 대상 이메일
	 * @param code 인증 코드
	 */
	@Transactional(readOnly = true)
	public void verifyPasswordResetCode(String email, String code) {
		EmailVerification emailVerification = emailVerificationRepository.findByEmailAndType(
			email,
			EmailVerificationType.PASSWORD_RESET
		).orElseThrow(GlobalErrorCode.DATA_NOT_FOUND::toException);

		if (emailVerification.isExpired()) {
			throw UserErrorCode.EXPIRED_EMAIL_CODE.toException();
		}

		if (!emailVerification.getCode().equals(code)) {
			throw UserErrorCode.INVALID_EMAIL_CODE.toException();
		}
	}

	/**
	 * 회원가입 관련 인증 데이터를 정리한다.
	 *
	 * @param email 대상 이메일
	 */
	@Transactional
	public void clearSignupVerification(String email) {
		emailVerificationRepository.deleteByEmailAndTypeIn(email, SIGNUP_TYPES);
	}

	/**
	 * 비밀번호 초기화용 인증 데이터를 정리한다.
	 *
	 * @param email 대상 이메일
	 */
	@Transactional
	public void clearPasswordResetVerification(String email) {
		emailVerificationRepository.deleteByEmailAndType(email, EmailVerificationType.PASSWORD_RESET);
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
	 * 매일 자정에 만료된 인증 데이터를 정리한다.
	 */
	@Scheduled(cron = "0 0 0 * * ?")
	@Transactional
	public void dailyCleanup() {
		int deletedCount = emailVerificationRepository.deleteByExpiresAtBefore(LocalDateTime.now());
		log.info("Daily: Delete Expired Verification {} Data", deletedCount);
	}

}
