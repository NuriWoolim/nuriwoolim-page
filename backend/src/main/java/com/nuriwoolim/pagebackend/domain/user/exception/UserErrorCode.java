package com.nuriwoolim.pagebackend.domain.user.exception;

import org.springframework.http.HttpStatus;

import com.nuriwoolim.pagebackend.global.exception.ErrorCode;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum UserErrorCode implements ErrorCode {

	/*
	 * 400 BAD_REQUEST
	 */
	ROLE_BAD_REQUEST(HttpStatus.BAD_REQUEST, "역할이 올바르지 않습니다."),
	PASSWORD_BAD_REQUEST(HttpStatus.BAD_REQUEST, "비밀번호가 올바르지 않습니다."),
	TOO_MANY_RESEND(HttpStatus.BAD_REQUEST, "인증 메일 재전송 요청이 너무 많습니다."),
	INVALID_EMAIL_CODE(HttpStatus.BAD_REQUEST, "이메일 인증 코드가 적절하지 않습니다"),
	EXPIRED_EMAIL_CODE(HttpStatus.BAD_REQUEST, "이메일 인증 코드가 만료되었습니다."),
	SIGNUP_NOT_VERIFIED(HttpStatus.BAD_REQUEST, "회원가입 이메일 인증이 완료되지 않았습니다."),

	/*
	 * 403 FORBIDDEN
	 */
	ADMIN_ACCESS_DENIED(HttpStatus.FORBIDDEN, "관리자 권한이 필요합니다."),
	ADMIN_ROLE_ASSIGN_DENIED(HttpStatus.FORBIDDEN, "ADMIN 역할을 할당할 권한이 없습니다."),
	SELF_ROLE_CHANGE_DENIED(HttpStatus.FORBIDDEN, "자신의 역할은 변경할 수 없습니다."),

	/*
	 * 404 NOT_FOUND
	 */
	USER_NOT_FOUND(HttpStatus.NOT_FOUND, "회원을 찾을 수 없습니다."),

	/*
	 * 409 CONFLICT
	 */
	USERNAME_CONFLICT(HttpStatus.CONFLICT, "존재하는 회원 이름입니다."),

	/*
	 * 500 INTERNAL_SERVER_ERROR
	 */
	MAIL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "메일 전송에 오류 발생");

    private final HttpStatus status;
    private final String message;
}

