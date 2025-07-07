package com.nuriwoolim.pagebackend.core.jwt.util;

import com.nuriwoolim.pagebackend.core.jwt.JwtConfig;
import com.nuriwoolim.pagebackend.core.jwt.dto.TokenBody;
import com.nuriwoolim.pagebackend.domain.user.dto.TokenPair;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Jwts.SIG;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.MacAlgorithm;
import java.util.Date;
import javax.crypto.SecretKey;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
@Slf4j
public class JwtTokenProvider {
    private final JwtConfig jwtConfig;
    private final MacAlgorithm macAlgorithm = SIG.HS256;

    public TokenPair issueTokenPair(Long userId) {
        return new TokenPair(
                issueAccessToken(userId),
                issueRefreshToken(userId)
        );
    }

    public String issueAccessToken(Long userId) {
        return issue(userId, jwtConfig.expire().access());
    }

    public String issueRefreshToken(Long userId) {
        return issue(userId, jwtConfig.expire().refresh());
    }

    private String issue(Long userId, Long expTime) {
        return Jwts.builder()
                .subject(userId.toString())
                .issuedAt(new Date())
                .expiration(new Date(new Date().getTime() + expTime))
                .signWith(getSecretKey(), macAlgorithm)
                .compact();
    }

    private SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(jwtConfig.secretKey().getBytes());
    }

    public void validate(String token) {
        JwtParser parser = getJwtParser();

        parser.parseSignedClaims(token);
    }


    private JwtParser getJwtParser() {
        return Jwts.parser()
                .verifyWith(getSecretKey())
                .build();
    }

    public TokenBody parseJwt(String token) {
        Jws<Claims> claimsJws = getJwtParser().parseSignedClaims(token);
        Long id = Long.parseLong(claimsJws.getPayload().getSubject());

        return TokenBody.builder()
                .id(id)
                .build();
    }
}
