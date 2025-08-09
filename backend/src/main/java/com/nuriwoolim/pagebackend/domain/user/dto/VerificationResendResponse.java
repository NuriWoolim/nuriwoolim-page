package com.nuriwoolim.pagebackend.domain.user.dto;

import lombok.Builder;

@Builder
public record VerificationResendResponse(
    String resendToken,
    int resendCount
) {

}
