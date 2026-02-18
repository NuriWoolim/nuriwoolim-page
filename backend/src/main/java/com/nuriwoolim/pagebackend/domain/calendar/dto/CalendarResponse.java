package com.nuriwoolim.pagebackend.domain.calendar.dto;

import java.time.LocalDate;
import lombok.Builder;

@Builder
public record CalendarResponse(
    Long id,
    String title,
    String description,
    String color,
    LocalDate date) {

}