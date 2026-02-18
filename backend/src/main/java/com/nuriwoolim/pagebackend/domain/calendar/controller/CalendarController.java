package com.nuriwoolim.pagebackend.domain.calendar.controller;

import com.nuriwoolim.pagebackend.core.jwt.dto.JwtPrincipal;
import com.nuriwoolim.pagebackend.domain.calendar.dto.CalendarCreateRequest;
import com.nuriwoolim.pagebackend.domain.calendar.dto.CalendarListResponse;
import com.nuriwoolim.pagebackend.domain.calendar.dto.CalendarResponse;
import com.nuriwoolim.pagebackend.domain.calendar.dto.CalendarUpdateRequest;
import com.nuriwoolim.pagebackend.domain.calendar.service.CalendarService;
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
@RequestMapping("/calendars")
public class CalendarController {

    private final CalendarService calendarService;

    @PostMapping
    public ResponseEntity<CalendarResponse> create(
        @Valid @RequestBody CalendarCreateRequest request,
        @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(calendarService.create(request, principal.getId()));
    }

    @GetMapping
    public ResponseEntity<CalendarListResponse> readBetween(
        @RequestParam(required = false) LocalDate from,
        @RequestParam(required = false) LocalDate to) {
        if (from == null || to == null) {
            from = LocalDate.now().withDayOfMonth(1);
            to = LocalDate.now().plusMonths(1).withDayOfMonth(1);
        }
        return ResponseEntity.ok(calendarService.findCalendarList(from, to));
    }

    @DeleteMapping("/{calendarId}")
    public ResponseEntity<Void> delete(@PathVariable Long calendarId,
        @AuthenticationPrincipal JwtPrincipal principal) {
        calendarService.deleteCalendarById(calendarId, principal.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{calendarId}")
    public ResponseEntity<CalendarResponse> update(
        @PathVariable Long calendarId,
        @Valid @RequestBody CalendarUpdateRequest request,
        @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(
            calendarService.updateCalendar(calendarId, request, principal.getId()));
    }
}
