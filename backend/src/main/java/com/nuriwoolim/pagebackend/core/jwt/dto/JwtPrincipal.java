package com.nuriwoolim.pagebackend.core.jwt.dto;

import java.security.Principal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class JwtPrincipal implements Principal {

    private final Long id;
    private final String email;
    private final String type;

    public static JwtPrincipal of(TokenBody tokenBody) {
        return JwtPrincipal.builder()
            .id(tokenBody.id())
            .email(tokenBody.email())
            .type(tokenBody.type())
            .build();
    }

    @Override
    public String getName() {
        return email;
    }
}
