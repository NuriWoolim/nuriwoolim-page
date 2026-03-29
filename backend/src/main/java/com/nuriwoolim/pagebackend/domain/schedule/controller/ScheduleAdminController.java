package com.nuriwoolim.pagebackend.domain.schedule.controller;

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
import org.springframework.web.bind.annotation.RestController;

import com.nuriwoolim.pagebackend.core.jwt.dto.JwtPrincipal;
import com.nuriwoolim.pagebackend.domain.schedule.dto.ScheduleCreateRequest;
import com.nuriwoolim.pagebackend.domain.schedule.dto.ScheduleResponse;
import com.nuriwoolim.pagebackend.domain.schedule.dto.ScheduleUpdateRequest;
import com.nuriwoolim.pagebackend.domain.schedule.service.ScheduleService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/schedules")
@Tag(name = "Admin - Schedule", description = "관리자 일정 관리 API")
public class ScheduleAdminController {

	private final ScheduleService scheduleService;

	@Operation(summary = "일정 등록", description = "새 일정을 등록합니다. ADMIN/MANAGER 전용.")
	@PostMapping
	public ResponseEntity<ScheduleResponse> create(
		@Valid @RequestBody ScheduleCreateRequest request,
		@AuthenticationPrincipal JwtPrincipal principal) {
		return ResponseEntity.status(HttpStatus.CREATED)
			.body(scheduleService.create(request, principal.getId()));
	}

	@Operation(summary = "일정 단건 조회", description = "일정 ID로 단건 조회합니다.")
	@GetMapping("/{scheduleId}")
	public ResponseEntity<ScheduleResponse> findById(@PathVariable Long scheduleId) {
		return ResponseEntity.ok(scheduleService.findById(scheduleId));
	}

	@Operation(summary = "일정 수정", description = "기존 일정을 수정합니다. ADMIN/MANAGER 전용.")
	@PatchMapping("/{scheduleId}")
	public ResponseEntity<ScheduleResponse> update(
		@PathVariable Long scheduleId,
		@Valid @RequestBody ScheduleUpdateRequest request,
		@AuthenticationPrincipal JwtPrincipal principal) {
		return ResponseEntity.ok(
			scheduleService.updateCalendar(scheduleId, request, principal.getId()));
	}

	@Operation(summary = "일정 삭제", description = "일정을 삭제합니다. ADMIN/MANAGER 전용.")
	@DeleteMapping("/{scheduleId}")
	public ResponseEntity<Void> delete(
		@PathVariable Long scheduleId,
		@AuthenticationPrincipal JwtPrincipal principal) {
		scheduleService.deleteCalendarById(scheduleId, principal.getId());
		return ResponseEntity.noContent().build();
	}
}

