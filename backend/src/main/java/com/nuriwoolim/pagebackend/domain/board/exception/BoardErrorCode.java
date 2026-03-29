package com.nuriwoolim.pagebackend.domain.board.exception;

import com.nuriwoolim.pagebackend.global.exception.ErrorCode;

import lombok.AllArgsConstructor;
import lombok.Getter;

import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum BoardErrorCode implements ErrorCode {

	/*
	 * 403 FORBIDDEN
	 */
	ANNOUNCEMENT_CREATE_FORBIDDEN(HttpStatus.FORBIDDEN, "공지 작성 권한이 없습니다."),

	/*
	 * 409 CONFLICT
	 */
	BOARD_TITLE_CONFLICT(HttpStatus.CONFLICT, "이미 존재하는 게시판입니다.");

	private final HttpStatus status;
	private final String message;
}

