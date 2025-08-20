package com.nuriwoolim.pagebackend.domain.calendar.util;

import com.nuriwoolim.pagebackend.domain.calendar.dto.CalendarCreateRequest;
import com.nuriwoolim.pagebackend.domain.calendar.dto.CalendarListResponse;
import com.nuriwoolim.pagebackend.domain.calendar.dto.CalendarResponse;
import com.nuriwoolim.pagebackend.domain.calendar.entity.Calendar;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class CalendarMapper {

    public static Calendar fromCalendarCreateRequest(CalendarCreateRequest request) {
        return Calendar.builder()
            .title(request.title())
            .description(request.description())
            .start(request.start())
            .end(request.end())
            .color(request.color())
            .build();
    }

    public static CalendarResponse toCalendarResponse(Calendar timeTable) {
        return CalendarResponse.builder()
            .id(timeTable.getId())
            .title(timeTable.getTitle())
            .description(timeTable.getDescription())
            .start(timeTable.getStart())
            .end(timeTable.getEnd())
            .color(timeTable.getColor())
            .build();
    }

    public static CalendarListResponse toCalendarListResponse(List<Calendar> calendars,
        LocalDateTime from,
        LocalDateTime to) {
        return CalendarListResponse.builder()
            .from(from)
            .to(to)
            .data(calendars.stream().map(CalendarMapper::toCalendarResponse).toList())
            .build();
    }
}
