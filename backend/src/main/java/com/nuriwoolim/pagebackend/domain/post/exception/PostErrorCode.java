package com.nuriwoolim.pagebackend.domain.post.exception;

import com.nuriwoolim.pagebackend.global.exception.ErrorCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum PostErrorCode implements ErrorCode {

    /*
     * 403 FORBIDDEN
     */
    POST_UPDATE_FORBIDDEN(HttpStatus.FORBIDDEN, "게시물 수정 권한이 없습니다."),
    POST_DELETE_FORBIDDEN(HttpStatus.FORBIDDEN, "게시물 삭제 권한이 없습니다."),

    /*
     * 409 CONFLICT
     */
    POST_TITLE_CONFLICT(HttpStatus.CONFLICT, "이미 존재하는 게시글입니다.");

    private final HttpStatus status;
    private final String message;
}

