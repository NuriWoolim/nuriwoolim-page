package com.nuriwoolim.pagebackend.domain.schedule.util;

import com.nuriwoolim.pagebackend.domain.schedule.dto.ScheduleCreateRequest;
import com.nuriwoolim.pagebackend.domain.schedule.dto.ScheduleListResponse;
import com.nuriwoolim.pagebackend.domain.schedule.dto.ScheduleResponse;
import com.nuriwoolim.pagebackend.domain.schedule.entity.Schedule;
import java.time.LocalDate;
import java.util.List;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ScheduleMapper {

    public static Schedule fromCalendarCreateRequest(ScheduleCreateRequest request) {
        return Schedule.builder()
            .title(request.title())
            .description(request.description())
            .date(request.date())
            .color(request.color())
            .build();
    }

    public static ScheduleResponse toCalendarResponse(Schedule timeTable) {
        return ScheduleResponse.builder()
            .id(timeTable.getId())
            .title(timeTable.getTitle())
            .description(timeTable.getDescription())
            .date(timeTable.getDate())
            .color(timeTable.getColor())
            .build();
    }

    public static ScheduleListResponse toCalendarListResponse(List<Schedule> schedules,
        LocalDate from,
        LocalDate to) {
        return ScheduleListResponse.builder()
            .from(from)
            .to(to)
            .data(schedules.stream().map(ScheduleMapper::toCalendarResponse).toList())
            .build();
    }
}
