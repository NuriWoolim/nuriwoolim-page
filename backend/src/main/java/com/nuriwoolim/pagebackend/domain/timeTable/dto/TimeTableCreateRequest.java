package com.nuriwoolim.pagebackend.domain.timeTable.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record TimeTableCreateRequest(
    @NotBlank
    String title,
    String description,
    @NotBlank
    String team,
    @NotBlank
    @Pattern(regexp = "^[0-9A-Fa-f]{6}$", message = "색상 코드는 6자리 16진수 형식이어야 합니다 (예: FFFFFF)")
    String color,

    @NotNull
    LocalDateTime start,
    @NotNull
    LocalDateTime end
) {

}
