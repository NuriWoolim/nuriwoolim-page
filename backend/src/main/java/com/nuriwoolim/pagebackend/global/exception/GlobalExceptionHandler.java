package com.nuriwoolim.pagebackend.global.exception;

import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /*
     * Custom Exception
     * */
    @ExceptionHandler(CustomException.class)
    protected ResponseEntity<ErrorResponse> handleCustomException(final CustomException e) {
        log.error("handleCustomException: {}", e.getErrorCode());
        return ResponseEntity
                .status(e.getErrorCode().getStatus().value())
                .body(new ErrorResponse(e));
    }

    /*
     * 유효성 검사 오류 메시지 반환
     * */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException e) {
        Map<String, String> errors = new HashMap<>();
        e.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    /*
     * HTTP 405 Exception
     * */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    protected ResponseEntity<ErrorResponse> handleHttpRequestMethodeNotSupportedException(
            final HttpRequestMethodNotSupportedException e) {
        log.error("handleHttpRequestMethodeNotSupportedException: {}", e.getMessage());
        return ResponseEntity
                .status(ErrorCode.METHOD_NOT_ALLOWED.getStatus().value())
                .body(new ErrorResponse(new CustomException(ErrorCode.METHOD_NOT_ALLOWED)));
    }

    /*
     * HTTP 500 Exception
     * */
    @ExceptionHandler(Exception.class)
    protected ResponseEntity<ErrorResponse> handleException(final Exception e) {
        log.error("handleException: {}", e.getMessage());
        return ResponseEntity
                .status(ErrorCode.INTERNAL_SERVER_ERROR.getStatus().value())
                .body(new ErrorResponse(new CustomException(ErrorCode.INTERNAL_SERVER_ERROR)));
    }
}