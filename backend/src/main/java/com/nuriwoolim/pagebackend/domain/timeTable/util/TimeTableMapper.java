package com.nuriwoolim.pagebackend.domain.timeTable.util;

import com.nuriwoolim.pagebackend.domain.timeTable.dto.TimeTableCreateRequest;
import com.nuriwoolim.pagebackend.domain.timeTable.dto.TimeTableListResponse;
import com.nuriwoolim.pagebackend.domain.timeTable.dto.TimeTableResponse;
import com.nuriwoolim.pagebackend.domain.timeTable.entity.TimeTable;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class TimeTableMapper {

    public static TimeTable fromTimeTableCreateRequest(TimeTableCreateRequest request, User user) {
        return TimeTable.builder()
            .title(request.title())
            .description(request.description())
            .team(request.team())
            .start(request.start())
            .end(request.end())
            .user(user)
            .color(request.color())
            .build();
    }

    public static TimeTableResponse toTimeTableResponse(TimeTable timeTable) {
        return TimeTableResponse.builder()
            .id(timeTable.getId())
            .title(timeTable.getTitle())
            .description(timeTable.getDescription())
            .team(timeTable.getTeam())
            .start(timeTable.getStart())
            .end(timeTable.getEnd())
            .color(timeTable.getColor())
            .ownerId(timeTable.getUser().getId())
            .ownerName(timeTable.getUser().getName())
            .build();
    }

    public static TimeTableListResponse toTimeTableListResponse(List<TimeTable> timeTables,
        LocalDateTime from,
        LocalDateTime to) {
        return TimeTableListResponse.builder()
            .from(from)
            .to(to)
            .data(timeTables.stream().map(TimeTableMapper::toTimeTableResponse).toList())
            .build();
    }
}
