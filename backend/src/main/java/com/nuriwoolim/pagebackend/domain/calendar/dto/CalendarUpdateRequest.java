package com.nuriwoolim.pagebackend.domain.calendar.dto;

import jakarta.validation.constraints.Pattern;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record CalendarUpdateRequest(
    String title,
    String description,
    @Pattern(regexp = "^[0-9A-Fa-f]{6}$", message = "색상 코드는 6자리 16진수 형식이어야 합니다 (예: FFFFFF)")
    String color,

    LocalDateTime start,
    LocalDateTime end
) {

}
