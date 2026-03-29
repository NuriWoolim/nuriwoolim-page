package com.nuriwoolim.pagebackend.core.security;

import java.io.IOException;
import java.io.PrintWriter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nuriwoolim.pagebackend.global.exception.ErrorResponse;
import com.nuriwoolim.pagebackend.global.exception.GlobalErrorCode;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

@Slf4j
@RequiredArgsConstructor
@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

	private final ObjectMapper objectMapper;

	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response,
		AccessDeniedException accessDeniedException) throws IOException {

		log.info("accessDeniedException.getMessage() == {}", accessDeniedException.getMessage());

		ErrorResponse error = new ErrorResponse(
			GlobalErrorCode.AUTHORITY_FORBIDDEN.toException(accessDeniedException.getMessage()));
		response.setContentType("application/json;charset=UTF-8");
		response.setStatus(error.getStatus());
		try (PrintWriter w = response.getWriter()) {
			w.write(objectMapper.writeValueAsString(error));
		}
	}
}

