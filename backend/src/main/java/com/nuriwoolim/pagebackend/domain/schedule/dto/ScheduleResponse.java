package com.nuriwoolim.pagebackend.domain.schedule.dto;

import java.time.LocalDate;
import lombok.Builder;

@Builder
public record ScheduleResponse(
    Long id,
    String title,
    String description,
    String color,
    LocalDate date) {

}