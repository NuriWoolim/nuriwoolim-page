package com.nuriwoolim.pagebackend.domain.timeTable.service;

import com.nuriwoolim.pagebackend.domain.timeTable.dto.TimeTableCreateRequest;
import com.nuriwoolim.pagebackend.domain.timeTable.dto.TimeTableListResponse;
import com.nuriwoolim.pagebackend.domain.timeTable.dto.TimeTableResponse;
import com.nuriwoolim.pagebackend.domain.timeTable.dto.TimeTableUpdateRequest;
import com.nuriwoolim.pagebackend.domain.timeTable.entity.TimeTable;
import com.nuriwoolim.pagebackend.domain.timeTable.repository.TimeTableRepository;
import com.nuriwoolim.pagebackend.domain.timeTable.util.TimeTableMapper;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.domain.user.service.UserService;
import com.nuriwoolim.pagebackend.global.exception.ErrorCode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
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
    public TimeTableResponse create(TimeTableCreateRequest request, Long actorId) {
        User user = userService.getUserById(actorId);
        TimeTable timetable = TimeTableMapper.fromTimeTableCreateRequest(request, user);
        validateTimeTable(timetable, actorId);

        TimeTable savedTimetable = timeTableRepository.save(timetable);
        return TimeTableMapper.toTimeTableResponse(savedTimetable);
    }

    private void validateTimeTable(TimeTable timeTable, Long actorId) {
        LocalDateTime start = timeTable.getStart();
        LocalDateTime end = timeTable.getEnd();
        //시작시간과 종료시간의 순서가 맞지 않는 경우
        if (!start.isBefore(end)) {
            throw ErrorCode.BAD_REQUEST.toException("시간이 잘못되었습니다.");
        }
        // 분 이하 단위가 있는 경우
        if (start.getMinute() != 0 ||
            start.getSecond() != 0 ||
            start.getNano() != 0 ||
            end.getMinute() != 0 ||
            end.getSecond() != 0 ||
            end.getNano() != 0) {
            throw ErrorCode.BAD_REQUEST.toException("시간이 잘못되었습니다.");
        }
        // 22시~익일9시 사이일경우
        if (start.toLocalTime().isBefore(LocalTime.of(9, 0)) || end.toLocalTime()
            .isAfter(LocalTime.of(22, 0))) {
            throw ErrorCode.BAD_REQUEST.toException("시간이 잘못되었습니다.");
        }
        // 운영자가 아닌데 2시간 이상을 잡을경우
        long minutes = Duration.between(timeTable.getStart(), timeTable.getEnd()).toMinutes();
        if (minutes > 120 || !userService.isManager(actorId)) {
            throw ErrorCode.BAD_REQUEST.toException("타임테이블이 너무 깁니다.");
        }
        // 다른 정보와 겹칠경우
        if (timeTableRepository.existsTimeTableBetweenExcludingId(timeTable.getId(), start, end)) {
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
        return TimeTableMapper.toTimeTableListResponse(timeTables, from, to);
    }

    @Transactional
    public void deleteTimeTableById(Long id, Long actorId) {
        validatePermission(getTimeTableById(id), actorId);
        timeTableRepository.deleteById(id);
    }

    private void validatePermission(TimeTable timeTable, Long actorId) {
        if (!timeTable.getUser().getId().equals(actorId) && !userService.isManager(actorId)) {
            throw ErrorCode.DATA_FORBIDDEN.toException();
        }
    }

    @Transactional
    public TimeTableResponse updateTimeTable(Long id, TimeTableUpdateRequest request,
        Long actorId) {
        validatePermission(getTimeTableById(id), actorId);

        TimeTable timeTable = getTimeTableById(id);
        timeTable.update(request);

        validateTimeTable(timeTable, actorId);
        return TimeTableMapper.toTimeTableResponse(timeTable);
    }

}
