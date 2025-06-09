package com.nuriwoolim.pagebackend.core.jwt;

import com.nuriwoolim.pagebackend.core.jwt.dto.TokenBody;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
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

    public boolean validate(String token) {
        try {
            JwtParser parser = getJwtParser();

            parser.parseSignedClaims(token);
            return true;
        } catch (JwtException e) {
            log.error("token={}", token);
            log.error("Invalid JWT");
        } catch (IllegalStateException e) {
            log.error("token={}", token);
            log.error("Weird JWT");
        } catch (Exception e) {
            log.error("token={}", token);
            log.error("Unexpected error");
        }
        return false;
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
