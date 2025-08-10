package com.nuriwoolim.pagebackend.domain.timeTable.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;

@Builder
public record TimeTableListResponse(
    LocalDateTime from,
    LocalDateTime to,
    List<TimeTableResponse> timetables
) {

}
