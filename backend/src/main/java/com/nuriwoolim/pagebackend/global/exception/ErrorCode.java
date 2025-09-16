package com.nuriwoolim.pagebackend.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    /*
     * 400 BAD_REQUEST: 잘못된 요청
     */
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "잘못된 요청입니다."),
    BAD_FILE_EXTENSION(HttpStatus.BAD_REQUEST, "파일 형식이 올바르지 않습니다."),
    ROLE_BAD_REQUEST(HttpStatus.BAD_REQUEST, "역할이 올바르지 않습니다."),
    PASSWORD_BAD_REQUEST(HttpStatus.BAD_REQUEST, "비밀번호가 올바르지 않습니다."),
    TOO_MANY_RESEND(HttpStatus.BAD_REQUEST, "인증 메일 재전송 요청이 너무 많습니다."),
    INVALID_EMAIL_CODE(HttpStatus.BAD_REQUEST, "이메일 인증 코드가 적절하지 않습니다"),

    /*
     *  401 Unauthroized
     */
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "인증 실패"),
    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "토큰이 만료되었습니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."),

    /*
     * 403 FORBIDDEN: 승인을 거부함
     */
    AUTHORITY_FORBIDDEN(HttpStatus.FORBIDDEN, "인가 실패"),
    DATA_FORBIDDEN(HttpStatus.FORBIDDEN, "데이터에 권한이 없습니다."),

    /*
     * 404 NOT_FOUND: 리소스를 찾을 수 없음
     */
    API_NOT_FOUND(HttpStatus.NOT_FOUND, "잘못된 경로입니다."),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "회원을 찾을 수 없습니다."),
    DATA_NOT_FOUND(HttpStatus.NOT_FOUND, "정보를 찾을 수 없습니다."),

    /*
     * 405 METHOD_NOT_ALLOWED: 허용되지 않은 Request Method 호출
     */
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "허용되지 않은 메서드입니다."),

    /*
     * 409 CONFLICT
     */
    DATA_CONFLICT(HttpStatus.CONFLICT, "적절하지 않은 데이터입니다."),
    USERNAME_CONFLICT(HttpStatus.CONFLICT, "존재하는 회원 이름입니다."),

    /*
     * 500 INTERNAL_SERVER_ERROR: 내부 서버 오류
     */
    MAIL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "메일 전송에 오류 발생"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "내부 서버 오류입니다.");

    private final HttpStatus status;
    private final String message;

    public CustomException toException(String detail) {
        return new CustomException(this, detail);
    }

    public CustomException toException() {
        return new CustomException(this);
    }

}
