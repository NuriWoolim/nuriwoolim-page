package com.nuriwoolim.pagebackend.domain.calendar.service;

import com.nuriwoolim.pagebackend.domain.calendar.dto.CalendarCreateRequest;
import com.nuriwoolim.pagebackend.domain.calendar.dto.CalendarListResponse;
import com.nuriwoolim.pagebackend.domain.calendar.dto.CalendarResponse;
import com.nuriwoolim.pagebackend.domain.calendar.dto.CalendarUpdateRequest;
import com.nuriwoolim.pagebackend.domain.calendar.entity.Calendar;
import com.nuriwoolim.pagebackend.domain.calendar.repository.CalendarRepository;
import com.nuriwoolim.pagebackend.domain.calendar.util.CalendarMapper;
import com.nuriwoolim.pagebackend.domain.user.service.UserService;
import com.nuriwoolim.pagebackend.global.exception.ErrorCode;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CalendarService {

    private final CalendarRepository calendarRepository;
    private final UserService userService;

    @Transactional
    public CalendarResponse create(CalendarCreateRequest request, Long actorId) {
        Calendar calendar = CalendarMapper.fromCalendarCreateRequest(request);
        validatePermission(actorId);
        validateCalendar(calendar);

        Calendar savedCalendar = calendarRepository.save(calendar);
        return CalendarMapper.toCalendarResponse(savedCalendar);
    }

    private void validateCalendar(Calendar calendar) {
        LocalDateTime start = calendar.getStart();
        LocalDateTime end = calendar.getEnd();
        //시작시간과 종료시간의 순서가 맞지 않는 경우
        if (!start.isBefore(end)) {
            throw ErrorCode.BAD_REQUEST.toException("시간이 잘못되었습니다.");
        }
    }

    @Transactional(readOnly = true)
    public Calendar getCalendarById(Long id) {
        return calendarRepository.findById(id).orElseThrow(ErrorCode.DATA_NOT_FOUND::toException);
    }

    @Transactional(readOnly = true)
    public CalendarResponse findById(Long id) {
        return CalendarMapper.toCalendarResponse(getCalendarById(id));
    }

    @Transactional(readOnly = true)
    public CalendarListResponse findCalendarList(LocalDateTime from, LocalDateTime to) {
        List<Calendar> calendars = calendarRepository.findBetween(from, to);
        return CalendarMapper.toCalendarListResponse(calendars, from, to);
    }

    @Transactional
    public void deleteCalendarById(Long id, Long actorId) {
        validatePermission(actorId);
        calendarRepository.deleteById(id);
    }

    private void validatePermission(Long actorId) {
        if (!userService.isManager(actorId)) {
            throw ErrorCode.DATA_FORBIDDEN.toException();
        }
    }

    @Transactional
    public CalendarResponse updateCalendar(Long id, CalendarUpdateRequest request,
        Long actorId) {
        validatePermission(actorId);

        Calendar calendar = getCalendarById(id);
        calendar.update(request);

        validateCalendar(calendar);
        return CalendarMapper.toCalendarResponse(calendar);
    }

}
