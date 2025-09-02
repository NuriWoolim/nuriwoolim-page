package com.nuriwoolim.pagebackend.core.jwt.dto;

import lombok.Builder;

@Builder
public record TokenBody(
    Long id,
    String email,
    String type
) {

}
