package com.nuriwoolim.pagebackend.core.jwt.util;

import com.nuriwoolim.pagebackend.core.jwt.JwtConfig;
import com.nuriwoolim.pagebackend.core.jwt.dto.TokenBody;
import com.nuriwoolim.pagebackend.domain.user.dto.TokenPair;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
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

    public TokenPair issueTokenPair(User user) {
        return new TokenPair(
            issueAccessToken(user),
            issueRefreshToken(user)
        );
    }

    public String issueAccessToken(User user) {
        return issue(user, jwtConfig.expire().access());
    }

    public String issueRefreshToken(User user) {
        return issue(user, jwtConfig.expire().refresh());
    }

    private String issue(User user, Long expTime) {
        return Jwts.builder()
            .subject(user.getId().toString())
            .claim("email", user.getEmail())
            .claim("type", user.getType().toString())
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
        String email = claimsJws.getPayload().get("email", String.class);
        String type = claimsJws.getPayload().get("type", String.class);

        return TokenBody.builder()
            .id(id)
            .email(email)
            .type(type)
            .build();
    }
}
