package com.nuriwoolim.pagebackend.domain.timeTable.util;

import com.nuriwoolim.pagebackend.domain.timeTable.dto.TimeTableCreateRequest;
import com.nuriwoolim.pagebackend.domain.timeTable.dto.TimeTableResponse;
import com.nuriwoolim.pagebackend.domain.timeTable.entity.TimeTable;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
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
            .build();
    }
}
