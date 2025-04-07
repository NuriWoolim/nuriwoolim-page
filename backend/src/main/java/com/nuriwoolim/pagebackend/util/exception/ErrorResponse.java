package com.nuriwoolim.pagebackend.util.exception;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ErrorResponse {

    private final LocalDateTime timestamp = LocalDateTime.now();
    private final int status;
    private final String error;
    private final String code;
    private final String message;
    private final String detail;

    public ErrorResponse(CustomException e) {
        ErrorCode errorCode = e.getErrorCode();
        this.status = errorCode.getStatus().value();
        this.error = errorCode.getStatus().name();
        this.code = errorCode.name();
        this.message = errorCode.getMessage();
        this.detail = e.getDetail();
    }
}
