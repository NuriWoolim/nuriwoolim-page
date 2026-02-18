package com.nuriwoolim.pagebackend.domain.schedule.controller;

import com.nuriwoolim.pagebackend.core.jwt.dto.JwtPrincipal;
import com.nuriwoolim.pagebackend.domain.schedule.dto.ScheduleCreateRequest;
import com.nuriwoolim.pagebackend.domain.schedule.dto.ScheduleListResponse;
import com.nuriwoolim.pagebackend.domain.schedule.dto.ScheduleResponse;
import com.nuriwoolim.pagebackend.domain.schedule.dto.ScheduleUpdateRequest;
import com.nuriwoolim.pagebackend.domain.schedule.service.ScheduleService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;

    @PostMapping
    public ResponseEntity<ScheduleResponse> create(
        @Valid @RequestBody ScheduleCreateRequest request,
        @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(scheduleService.create(request, principal.getId()));
    }

    @GetMapping
    public ResponseEntity<ScheduleListResponse> readBetween(
        @RequestParam(required = false) LocalDate from,
        @RequestParam(required = false) LocalDate to) {
        if (from == null || to == null) {
            from = LocalDate.now().withDayOfMonth(1);
            to = LocalDate.now().plusMonths(1).withDayOfMonth(1);
        }
        return ResponseEntity.ok(scheduleService.findCalendarList(from, to));
    }

    @DeleteMapping("/{calendarId}")
    public ResponseEntity<Void> delete(@PathVariable Long calendarId,
        @AuthenticationPrincipal JwtPrincipal principal) {
        scheduleService.deleteCalendarById(calendarId, principal.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{calendarId}")
    public ResponseEntity<ScheduleResponse> update(
        @PathVariable Long calendarId,
        @Valid @RequestBody ScheduleUpdateRequest request,
        @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(
            scheduleService.updateCalendar(calendarId, request, principal.getId()));
    }
}
