package com.nuriwoolim.pagebackend.global.exception;

import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /*
     * Custom Exception
     * */
    @ExceptionHandler(CustomException.class)
    protected ResponseEntity<ErrorResponse> handleCustomException(final CustomException e) {
        log.debug("handleCustomException: {}", e.getErrorCode());
        return ResponseEntity
            .status(e.getErrorCode().getStatus())
            .body(new ErrorResponse(e));
    }

    /*
     * 유효성 검사 오류 메시지 반환
     * */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    protected ResponseEntity<Map<String, String>> handleValidationExceptions(
        MethodArgumentNotValidException e) {
        log.debug("handleValidationExceptions: {}", e.getMessage());
        Map<String, String> errors = new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach((error) -> {
            String fieldName = error.getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    // 인증은 되었지만 권한이 없는 경우
    @ExceptionHandler(AccessDeniedException.class)
    protected ResponseEntity<ErrorResponse> handleAccessDeniedException(
        final AccessDeniedException e) {
        log.debug("handleAccessDeniedException: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(new ErrorResponse(ErrorCode.AUTHORITY_FORBIDDEN.toException()));
    }

    // 인증 자체가 실패한 경우 (로그인 안 됨, 토큰 만료 등)
    @ExceptionHandler(AuthenticationException.class)
    protected ResponseEntity<ErrorResponse> handleAuthenticationException(
        final AuthenticationException e) {
        log.debug("handleAuthenticationException: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ErrorResponse(ErrorCode.UNAUTHORIZED.toException()));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    protected ResponseEntity<ErrorResponse> handleDataIntegrityViolationException(
        DataIntegrityViolationException e) {
        log.debug("handleDataIntegrityViolationException: {}", e.getCause().getMessage());

        return ResponseEntity.status(HttpStatus.CONFLICT).body(
            new ErrorResponse(ErrorCode.DATA_CONFLICT.toException()));
    }


    /*
     * HTTP 404 잘못된 api 경로
     */
    @ExceptionHandler({NoHandlerFoundException.class, NoResourceFoundException.class})
    protected ResponseEntity<ErrorResponse> handleNoHandlerFoundException(final Exception e) {
        log.trace("handleNoHandlerFoundException: {}", e.getMessage());
        return ResponseEntity
            .status(ErrorCode.API_NOT_FOUND.getStatus())
            .body(new ErrorResponse(ErrorCode.API_NOT_FOUND.toException()));
    }

    /*
     * HTTP 500 Exception
     * */
    @ExceptionHandler(Exception.class)
    protected ResponseEntity<ErrorResponse> handleException(final Exception e) {
        log.error("handleException: {}", e.getMessage());
        return ResponseEntity
            .status(ErrorCode.INTERNAL_SERVER_ERROR.getStatus())
            .body(new ErrorResponse(ErrorCode.INTERNAL_SERVER_ERROR.toException()));
    }
}