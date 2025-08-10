package com.nuriwoolim.pagebackend.domain.timeTable.dto;

import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record TimeTableUpdateRequest(
    String title,
    String description,
    String team,

    LocalDateTime start,
    LocalDateTime end
) {

}
