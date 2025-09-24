package com.nuriwoolim.pagebackend.domain.calendar.dto;

import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record CalendarResponse(
    Long id,
    String title,
    String description,
    String color,
    LocalDateTime start,
    LocalDateTime end) {
}