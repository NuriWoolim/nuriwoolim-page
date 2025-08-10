package com.nuriwoolim.pagebackend.domain.timeTable.controller;

import com.nuriwoolim.pagebackend.core.jwt.dto.JwtPrincipal;
import com.nuriwoolim.pagebackend.domain.timeTable.dto.TimeTableCreateRequest;
import com.nuriwoolim.pagebackend.domain.timeTable.dto.TimeTableListResponse;
import com.nuriwoolim.pagebackend.domain.timeTable.dto.TimeTableResponse;
import com.nuriwoolim.pagebackend.domain.timeTable.service.TimeTableService;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/timetables")
public class TimeTableController {

    private final TimeTableService timeTableService;

    @PostMapping
    public ResponseEntity<TimeTableResponse> create(@RequestBody TimeTableCreateRequest request,
        @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(timeTableService.create(request, principal.getId()));
    }

    @GetMapping
    public ResponseEntity<TimeTableListResponse> readBetween(
        @RequestParam(required = false) LocalDateTime from,
        @RequestParam(required = false) LocalDateTime to) {
        if (from == null || to == null) {
            from = LocalDateTime.now().toLocalDate().withDayOfMonth(1).atStartOfDay();
            to = LocalDateTime.now().toLocalDate().plusMonths(1).withDayOfMonth(1).atStartOfDay();
        }
        return ResponseEntity.ok(timeTableService.findTimeTableList(from, to));
    }


}
