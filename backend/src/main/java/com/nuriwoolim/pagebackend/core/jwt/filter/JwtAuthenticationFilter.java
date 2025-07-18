package com.nuriwoolim.pagebackend.core.jwt.filter;

import com.nuriwoolim.pagebackend.core.jwt.dto.TokenBody;
import com.nuriwoolim.pagebackend.core.jwt.util.JwtTokenProvider;
import com.nuriwoolim.pagebackend.core.security.CustomEntryPoint;
import com.nuriwoolim.pagebackend.core.security.CustomUserDetailsService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
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
    protected void doFilterInternal(@NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain)
        throws ServletException, IOException {
        // OPTIONS 요청은 JWT 검증 없이 통과
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }
        String token = resolveAccessToken(request);
        log.debug("Enter Filter: {}", token);
        if (token != null) {
            try {
                try {
                    jwtTokenProvider.validate(token);
                    setAuthentication(token);
                } catch (ExpiredJwtException e) {
                    SecurityContextHolder.clearContext();
                    customEntryPoint.commenceExpiredToken(response);
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
}
