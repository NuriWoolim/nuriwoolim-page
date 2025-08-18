package com.nuriwoolim.pagebackend.domain.calendar.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;

@Builder
public record CalendarListResponse(
    LocalDateTime from,
    LocalDateTime to,
    List<CalendarResponse> data
) {

}
