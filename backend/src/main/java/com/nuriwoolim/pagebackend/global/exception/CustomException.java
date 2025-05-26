package com.nuriwoolim.pagebackend.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CustomException extends RuntimeException {
    private final ErrorCode errorCode;
    private final String detail;

    public CustomException(ErrorCode errorCode) {
        this(errorCode, null);
    }
}
