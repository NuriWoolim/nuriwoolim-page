package com.nuriwoolim.pagebackend.domain.user.controller;

import com.nuriwoolim.pagebackend.core.jwt.dto.JwtPrincipal;
import com.nuriwoolim.pagebackend.domain.comment.dto.CommentResponse;
import com.nuriwoolim.pagebackend.domain.post.dto.PostResponse;
import com.nuriwoolim.pagebackend.domain.user.dto.AdminChangeRoleRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.AdminDashboardResponse;
import com.nuriwoolim.pagebackend.domain.user.dto.AdminUserDetailResponse;
import com.nuriwoolim.pagebackend.domain.user.dto.AdminUserSummaryResponse;
import com.nuriwoolim.pagebackend.domain.user.entity.UserType;
import com.nuriwoolim.pagebackend.domain.user.service.UserAdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/users")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
@Tag(name = "Admin - User", description = "관리자 유저 관리 API")
public class UserAdminController {

    private final UserAdminService userAdminService;

    @Operation(summary = "대시보드 통계", description = "전체 유저·글·댓글·일정 수 등 통계 정보를 조회합니다.")
    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> dashboard(
        @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(userAdminService.getDashboard(principal.getId()));
    }

    @Operation(summary = "유저 목록 조회", description = "이름/이메일 검색, 역할 필터링, 페이징을 지원합니다.")
    @GetMapping
    public ResponseEntity<Page<AdminUserSummaryResponse>> getUsers(
        @AuthenticationPrincipal JwtPrincipal principal,
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) UserType type,
        @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(
            userAdminService.getUsers(principal.getId(), keyword, type, pageable));
    }

    @Operation(summary = "유저 상세 조회", description = "유저 정보와 작성한 글·댓글 수를 함께 조회합니다.")
    @GetMapping("/{userId}")
    public ResponseEntity<AdminUserDetailResponse> getUserDetail(
        @AuthenticationPrincipal JwtPrincipal principal,
        @PathVariable Long userId) {
        return ResponseEntity.ok(
            userAdminService.getUserDetail(principal.getId(), userId));
    }

    @Operation(summary = "유저 작성 글 조회", description = "특정 유저가 작성한 게시글 목록을 페이징으로 조회합니다.")
    @GetMapping("/{userId}/posts")
    public ResponseEntity<Page<PostResponse>> getUserPosts(
        @AuthenticationPrincipal JwtPrincipal principal,
        @PathVariable Long userId,
        @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(
            userAdminService.getUserPosts(principal.getId(), userId, pageable));
    }

    @Operation(summary = "유저 작성 댓글 조회", description = "특정 유저가 작성한 댓글 목록을 페이징으로 조회합니다.")
    @GetMapping("/{userId}/comments")
    public ResponseEntity<Page<CommentResponse>> getUserComments(
        @AuthenticationPrincipal JwtPrincipal principal,
        @PathVariable Long userId,
        @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(
            userAdminService.getUserComments(principal.getId(), userId, pageable));
    }

    @Operation(summary = "유저 역할 변경",
        description = "유저의 역할(등급)을 변경합니다. MANAGER는 ADMIN 역할을 할당할 수 없습니다.")
    @PatchMapping("/{userId}/role")
    public ResponseEntity<AdminUserDetailResponse> changeUserRole(
        @AuthenticationPrincipal JwtPrincipal principal,
        @PathVariable Long userId,
        @Valid @RequestBody AdminChangeRoleRequest request) {
        return ResponseEntity.ok(
            userAdminService.changeUserRole(principal.getId(), userId, request));
    }

    @Operation(summary = "유저 삭제", description = "유저를 삭제합니다. MANAGER는 ADMIN 사용자를 삭제할 수 없습니다.")
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(
        @AuthenticationPrincipal JwtPrincipal principal,
        @PathVariable Long userId) {
        userAdminService.deleteUser(principal.getId(), userId);
        return ResponseEntity.noContent().build();
    }
}

