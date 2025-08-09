package com.nuriwoolim.pagebackend.domain.timeTable.service;

import com.nuriwoolim.pagebackend.domain.timeTable.dto.TimeTableCreateRequest;
import com.nuriwoolim.pagebackend.domain.timeTable.dto.TimeTableResponse;
import com.nuriwoolim.pagebackend.domain.timeTable.entity.TimeTable;
import com.nuriwoolim.pagebackend.domain.timeTable.repository.TimeTableRepository;
import com.nuriwoolim.pagebackend.domain.timeTable.util.TimeTableMapper;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.domain.user.service.UserService;
import com.nuriwoolim.pagebackend.global.exception.ErrorCode;
import java.time.Duration;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TimeTableService {

    private final TimeTableRepository timeTableRepository;
    private final UserService userService;

    @Transactional
    public TimeTableResponse create(TimeTableCreateRequest request, Long userId) {
        User user = userService.getUserById(userId);
        TimeTable timeTable = TimeTableMapper.fromTimeTableCreateRequest(request, user);
        validateTimeTable(timeTable);

        TimeTable timetable = timeTableRepository.save(timeTable);
        return TimeTableMapper.toTimeTableResponse(timetable);
    }

    private void validateTimeTable(TimeTable timeTable) {
        if (!timeTable.getStart().isBefore(timeTable.getEnd())) {
            throw ErrorCode.BAD_REQUEST.toException("시간이 잘못되었습니다.");
        }

        long minutes = Duration.between(timeTable.getStart(), timeTable.getEnd()).toMinutes();
        if (minutes > 120) {
            throw ErrorCode.BAD_REQUEST.toException("타임테이블이 너무 깁니다.");
        }
    }
}
