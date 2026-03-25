package com.nuriwoolim.pagebackend.domain.schedule.controller;

import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nuriwoolim.pagebackend.domain.schedule.dto.ScheduleListResponse;
import com.nuriwoolim.pagebackend.domain.schedule.service.ScheduleService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/schedules")
@Tag(name = "Schedule", description = "일정 관리 API")
public class ScheduleController {

	private final ScheduleService scheduleService;

	@Operation(summary = "일정 목록 조회", description = "기간별 일정 목록을 조회합니다. from이나 to가 null 이면 현재달을 조회합니다.")
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
}
