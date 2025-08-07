package com.nuriwoolim.pagebackend.domain.timeTable.dto;

import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record TimeTableResponse(
    Long id,
    String title,
    String team,
    String description,
    LocalDateTime start,
    LocalDateTime end) {

}