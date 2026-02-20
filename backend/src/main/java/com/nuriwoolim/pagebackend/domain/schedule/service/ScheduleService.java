package com.nuriwoolim.pagebackend.domain.schedule.service;

import com.nuriwoolim.pagebackend.domain.schedule.dto.ScheduleCreateRequest;
import com.nuriwoolim.pagebackend.domain.schedule.dto.ScheduleListResponse;
import com.nuriwoolim.pagebackend.domain.schedule.dto.ScheduleResponse;
import com.nuriwoolim.pagebackend.domain.schedule.dto.ScheduleUpdateRequest;
import com.nuriwoolim.pagebackend.domain.schedule.entity.Schedule;
import com.nuriwoolim.pagebackend.domain.schedule.repository.ScheduleRepository;
import com.nuriwoolim.pagebackend.domain.schedule.util.ScheduleMapper;
import com.nuriwoolim.pagebackend.domain.user.service.UserService;
import com.nuriwoolim.pagebackend.global.exception.ErrorCode;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final UserService userService;

    @Transactional
    public ScheduleResponse create(ScheduleCreateRequest request, Long actorId) {
        Schedule schedule = ScheduleMapper.fromCalendarCreateRequest(request);
        validatePermission(actorId);

        Schedule savedSchedule = scheduleRepository.save(schedule);
        return ScheduleMapper.toCalendarResponse(savedSchedule);
    }

    @Transactional(readOnly = true)
    public Schedule getCalendarById(Long id) {
        return scheduleRepository.findById(id).orElseThrow(ErrorCode.DATA_NOT_FOUND::toException);
    }

    @Transactional(readOnly = true)
    public ScheduleResponse findById(Long id) {
        return ScheduleMapper.toCalendarResponse(getCalendarById(id));
    }

    @Transactional(readOnly = true)
    public ScheduleListResponse findCalendarList(LocalDate from, LocalDate to) {
        List<Schedule> schedules = scheduleRepository.findBetween(from, to);
        return ScheduleMapper.toCalendarListResponse(schedules, from, to);
    }

    @Transactional
    public void deleteCalendarById(Long id, Long actorId) {
        validatePermission(actorId);
        scheduleRepository.deleteById(id);
    }

    private void validatePermission(Long actorId) {
        if (!userService.isManager(actorId)) {
            throw ErrorCode.DATA_FORBIDDEN.toException();
        }
    }

    @Transactional
    public ScheduleResponse updateCalendar(Long id, ScheduleUpdateRequest request,
        Long actorId) {
        validatePermission(actorId);

        Schedule schedule = getCalendarById(id);
        schedule.update(request);

        return ScheduleMapper.toCalendarResponse(schedule);
    }

}
