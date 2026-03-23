package com.nuriwoolim.pagebackend.global.exception;

import org.springframework.http.HttpStatus;

public interface ErrorCode {

    HttpStatus getStatus();

    String getMessage();

    /** enum이 기본 제공하는 name()을 인터페이스 계약으로 선언 */
    String name();

    default CustomException toException() {
        return new CustomException(this);
    }

    default CustomException toException(String detail) {
        return new CustomException(this, detail);
    }
}
