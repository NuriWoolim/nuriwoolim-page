package com.nuriwoolim.pagebackend.core.jwt.filter;

import com.nuriwoolim.pagebackend.core.jwt.dto.JwtPrincipal;
import com.nuriwoolim.pagebackend.core.jwt.dto.TokenBody;
import com.nuriwoolim.pagebackend.core.jwt.util.JwtTokenProvider;
import com.nuriwoolim.pagebackend.core.security.CustomEntryPoint;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
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
                    return;
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
        JwtPrincipal jwtPrincipal = JwtPrincipal.of(tokenBody);
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
            jwtPrincipal,
            null,
            List.of(new SimpleGrantedAuthority(jwtPrincipal.getType()))
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
