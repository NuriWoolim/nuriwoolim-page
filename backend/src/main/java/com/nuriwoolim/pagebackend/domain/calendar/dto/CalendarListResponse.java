package com.nuriwoolim.pagebackend.domain.calendar.dto;

import java.time.LocalDate;
import java.util.List;
import lombok.Builder;

@Builder
public record CalendarListResponse(
    LocalDate from,
    LocalDate to,
    List<CalendarResponse> data
) {

}
