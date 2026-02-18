package com.nuriwoolim.pagebackend.domain.schedule.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;
import lombok.Builder;

@Builder
public record ScheduleCreateRequest(
    @NotBlank
    String title,
    String description,

    @NotBlank
    @Pattern(regexp = "^[0-9A-Fa-f]{6}$", message = "색상 코드는 6자리 16진수 형식이어야 합니다 (예: FFFFFF)")
    String color,

    @NotNull
    LocalDate date
) {

}
