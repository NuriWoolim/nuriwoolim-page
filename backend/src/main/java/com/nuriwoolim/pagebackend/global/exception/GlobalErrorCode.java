package com.nuriwoolim.pagebackend.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum GlobalErrorCode implements ErrorCode {

    /*
     * 400 BAD_REQUEST
     */
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "잘못된 요청입니다."),
    BAD_FILE_EXTENSION(HttpStatus.BAD_REQUEST, "파일 형식이 올바르지 않습니다."),

    /*
     * 401 UNAUTHORIZED
     */
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "인증 실패"),
    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "토큰이 만료되었습니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."),

    /*
     * 403 FORBIDDEN
     */
    AUTHORITY_FORBIDDEN(HttpStatus.FORBIDDEN, "인가 실패"),
    DATA_FORBIDDEN(HttpStatus.FORBIDDEN, "데이터에 권한이 없습니다."),

    /*
     * 404 NOT_FOUND
     */
    API_NOT_FOUND(HttpStatus.NOT_FOUND, "잘못된 경로입니다."),
    DATA_NOT_FOUND(HttpStatus.NOT_FOUND, "정보를 찾을 수 없습니다."),

    /*
     * 405 METHOD_NOT_ALLOWED
     */
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "허용되지 않은 메서드입니다."),

    /*
     * 409 CONFLICT
     */
    DATA_CONFLICT(HttpStatus.CONFLICT, "적절하지 않은 데이터입니다."),

    /*
     * 500 INTERNAL_SERVER_ERROR
     */
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "내부 서버 오류입니다.");

    private final HttpStatus status;
    private final String message;
}

