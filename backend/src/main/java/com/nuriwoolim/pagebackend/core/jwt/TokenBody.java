package com.nuriwoolim.pagebackend.core.jwt;

import lombok.Builder;

@Builder
public record TokenBody(
        Long id
) {
}
