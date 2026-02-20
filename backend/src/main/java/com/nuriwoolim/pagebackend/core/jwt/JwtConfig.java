package com.nuriwoolim.pagebackend.core.jwt;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "custom.jwt")
public record JwtConfig(
    Expire expire,
    String secretKey
) {

    public record Expire(Long access, Long refresh) {

    }
}
