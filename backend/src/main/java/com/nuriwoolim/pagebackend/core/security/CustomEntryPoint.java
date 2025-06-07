package com.nuriwoolim.pagebackend.core.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nuriwoolim.pagebackend.global.exception.ErrorCode;
import com.nuriwoolim.pagebackend.global.exception.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@Slf4j
@RequiredArgsConstructor
@Component
public class CustomEntryPoint implements AuthenticationEntryPoint {
    private final ObjectMapper objectMapper;


    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {

        log.info("authException.getMessage() == {}", authException.getMessage());

        ErrorResponse error = new ErrorResponse(ErrorCode.UNAUTHORIZED.toException());
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(error.getStatus());
        try (PrintWriter w = response.getWriter()) {
            w.write(objectMapper.writeValueAsString(error));
        }
    }
}
