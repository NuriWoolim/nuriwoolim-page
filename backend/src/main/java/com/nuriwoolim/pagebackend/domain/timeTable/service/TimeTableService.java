package com.nuriwoolim.pagebackend.domain.timeTable.service;

import com.nuriwoolim.pagebackend.domain.timeTable.dto.TimeTableCreateRequest;
import com.nuriwoolim.pagebackend.domain.timeTable.dto.TimeTableListResponse;
import com.nuriwoolim.pagebackend.domain.timeTable.dto.TimeTableResponse;
import com.nuriwoolim.pagebackend.domain.timeTable.entity.TimeTable;
import com.nuriwoolim.pagebackend.domain.timeTable.repository.TimeTableRepository;
import com.nuriwoolim.pagebackend.domain.timeTable.util.TimeTableMapper;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.domain.user.service.UserService;
import com.nuriwoolim.pagebackend.global.exception.ErrorCode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
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
        LocalDateTime start = timeTable.getStart();
        LocalDateTime end = timeTable.getEnd();
        if (!start.isBefore(end)) {
            throw ErrorCode.BAD_REQUEST.toException("시간이 잘못되었습니다.");
        }
        if (start.getMinute() != 0 ||
            start.getSecond() != 0 ||
            start.getNano() != 0 ||
            end.getMinute() != 0 ||
            end.getSecond() != 0 ||
            end.getNano() != 0) {
            throw ErrorCode.BAD_REQUEST.toException("시간이 잘못되었습니다.");
        }

        long minutes = Duration.between(timeTable.getStart(), timeTable.getEnd()).toMinutes();
        if (minutes > 120) {
            throw ErrorCode.BAD_REQUEST.toException("타임테이블이 너무 깁니다.");
        }
        if (timeTableRepository.existsTimeTableBetween(start, end)) {
            throw ErrorCode.DATA_CONFLICT.toException("다른 정보와 충돌합니다.");
        }
    }

    @Transactional(readOnly = true)
    public TimeTable getTimeTableById(Long id) {
        return timeTableRepository.findById(id).orElseThrow(ErrorCode.DATA_NOT_FOUND::toException);
    }

    @Transactional(readOnly = true)
    public TimeTableResponse findById(Long id) {
        return TimeTableMapper.toTimeTableResponse(getTimeTableById(id));
    }

    @Transactional(readOnly = true)
    public TimeTableListResponse findTimeTableList(LocalDateTime from, LocalDateTime to) {
        List<TimeTable> timeTables = timeTableRepository.findBetween(from, to);
        return TimeTableMapper.timeTableListResponse(timeTables, from, to);
    }

}
