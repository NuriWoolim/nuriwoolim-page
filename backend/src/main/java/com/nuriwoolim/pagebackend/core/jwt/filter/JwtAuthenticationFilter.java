package com.nuriwoolim.pagebackend.core.jwt.filter;

import com.nuriwoolim.pagebackend.core.jwt.dto.TokenBody;
import com.nuriwoolim.pagebackend.core.jwt.util.JwtTokenProvider;
import com.nuriwoolim.pagebackend.core.security.CustomEntryPoint;
import com.nuriwoolim.pagebackend.core.security.CustomUserDetailsService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService userDetailsService;
    private final CustomEntryPoint customEntryPoint;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = resolveAccessToken(request);
        log.debug("Enter Filter: {}", token);
        if (token != null) {
            try {
                try {
                    jwtTokenProvider.validate(token);
                    setAuthentication(token);
                } catch (JwtException | IllegalArgumentException e) {
                    throw new BadCredentialsException("Invalid token");
                }
            } catch (AuthenticationException e) {
                SecurityContextHolder.clearContext();
                customEntryPoint.commence(request, response, e);
                return;
            }
        }
        filterChain.doFilter(request, response);
    }

    private void setAuthentication(String accessToken) {
        TokenBody tokenBody = jwtTokenProvider.parseJwt(accessToken);
        UserDetails userDetails = userDetailsService.loadUserById(tokenBody.id());
        log.debug("User: {}", userDetails);
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private String resolveAccessToken(HttpServletRequest request) {
        String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authorization != null && authorization.startsWith("Bearer ")) {
            return authorization.substring(7);
        }
        return null;
    }

    private String resolveRefreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
