package com.nuriwoolim.pagebackend.domain.schedule.dto;

import java.time.LocalDate;
import java.util.List;
import lombok.Builder;

@Builder
public record ScheduleListResponse(
    LocalDate from,
    LocalDate to,
    List<ScheduleResponse> data
) {

}
