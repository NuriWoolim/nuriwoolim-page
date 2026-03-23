package com.nuriwoolim.pagebackend.domain.user.service;

import com.nuriwoolim.pagebackend.domain.comment.dto.CommentResponse;
import com.nuriwoolim.pagebackend.domain.comment.repository.CommentRepository;
import com.nuriwoolim.pagebackend.domain.post.dto.PostResponse;
import com.nuriwoolim.pagebackend.domain.post.repository.PostRepository;
import com.nuriwoolim.pagebackend.domain.schedule.repository.ScheduleRepository;
import com.nuriwoolim.pagebackend.domain.user.dto.AdminChangeRoleRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.AdminDashboardResponse;
import com.nuriwoolim.pagebackend.domain.user.dto.AdminUserDetailResponse;
import com.nuriwoolim.pagebackend.domain.user.dto.AdminUserSummaryResponse;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.domain.user.entity.UserType;
import com.nuriwoolim.pagebackend.domain.user.exception.UserErrorCode;
import com.nuriwoolim.pagebackend.domain.user.repository.UserRepository;
import com.nuriwoolim.pagebackend.domain.user.util.AdminUserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserAdminService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final ScheduleRepository scheduleRepository;

    // ──────────────────────────────────────────────
    // 권한 검증
    // ──────────────────────────────────────────────

    /**
     * 요청자가 ADMIN 또는 MANAGER인지만 검증한다. (단일 책임)
     */
    private void validateAdminAccess(Long actorId) {
        User actor = getActorById(actorId);
        if (actor.getType() != UserType.ADMIN && actor.getType() != UserType.MANAGER) {
            throw UserErrorCode.ADMIN_ACCESS_DENIED.toException();
        }
    }

    private User getActorById(Long actorId) {
        return userRepository.findById(actorId)
            .orElseThrow(UserErrorCode.USER_NOT_FOUND::toException);
    }

    // ──────────────────────────────────────────────
    // 대시보드
    // ──────────────────────────────────────────────

    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard(Long actorId) {
        validateAdminAccess(actorId);

        return AdminDashboardResponse.builder()
            .totalUsers((int) userRepository.count())
            .adminCount((int) userRepository.countByType(UserType.ADMIN))
            .managerCount((int) userRepository.countByType(UserType.MANAGER))
            .memberCount((int) userRepository.countByType(UserType.MEMBER))
            .nonMemberCount((int) userRepository.countByType(UserType.NONMEMBER))
            .totalPosts((int) postRepository.count())
            .totalComments((int) commentRepository.count())
            .totalSchedules((int) scheduleRepository.count())
            .build();
    }

    // ──────────────────────────────────────────────
    // 유저 목록 조회 (검색 + 필터 + 페이징)
    // ──────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Page<AdminUserSummaryResponse> getUsers(Long actorId, String keyword,
        UserType type, Pageable pageable) {
        validateAdminAccess(actorId);

        Page<User> users;
        if (type != null && keyword != null && !keyword.isBlank()) {
            users = userRepository.findByTypeAndKeyword(type, keyword.trim(), pageable);
        } else if (type != null) {
            users = userRepository.findByType(type, pageable);
        } else if (keyword != null && !keyword.isBlank()) {
            users = userRepository.findByKeyword(keyword.trim(), pageable);
        } else {
            users = userRepository.findAll(pageable);
        }

        return users.map(AdminUserMapper::toSummary);
    }

    // ──────────────────────────────────────────────
    // 유저 상세 조회 (글/댓글 수 포함)
    // ──────────────────────────────────────────────

    @Transactional(readOnly = true)
    public AdminUserDetailResponse getUserDetail(Long actorId, Long targetUserId) {
        validateAdminAccess(actorId);

        User user = userRepository.findById(targetUserId)
            .orElseThrow(UserErrorCode.USER_NOT_FOUND::toException);

        int postCount = (int) postRepository.countByWriterId(targetUserId);
        int commentCount = (int) commentRepository.countByWriterId(targetUserId);

        return AdminUserMapper.toDetail(user, postCount, commentCount);
    }

    // ──────────────────────────────────────────────
    // 유저가 쓴 글 조회
    // ──────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Page<PostResponse> getUserPosts(Long actorId, Long targetUserId, Pageable pageable) {
        validateAdminAccess(actorId);

        userRepository.findById(targetUserId)
            .orElseThrow(UserErrorCode.USER_NOT_FOUND::toException);

        return postRepository.findByWriterId(targetUserId, pageable)
            .map(AdminUserMapper::toPostResponse);
    }

    // ──────────────────────────────────────────────
    // 유저가 쓴 댓글 조회
    // ──────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Page<CommentResponse> getUserComments(Long actorId, Long targetUserId, Pageable pageable) {
        validateAdminAccess(actorId);

        userRepository.findById(targetUserId)
            .orElseThrow(UserErrorCode.USER_NOT_FOUND::toException);

        return commentRepository.findByWriterId(targetUserId, pageable)
            .map(AdminUserMapper::toCommentResponse);
    }

    // ──────────────────────────────────────────────
    // 유저 등급(역할) 변경
    // ──────────────────────────────────────────────

    @Transactional
    public AdminUserDetailResponse changeUserRole(Long actorId, Long targetUserId,
        AdminChangeRoleRequest request) {
        validateAdminAccess(actorId);
        User actor = getActorById(actorId); // JPA 1차 캐시에서 재사용

        // 자기 자신의 역할은 변경 불가
        if (actorId.equals(targetUserId)) {
            throw UserErrorCode.SELF_ROLE_CHANGE_DENIED.toException();
        }

        // MANAGER는 ADMIN 역할을 부여할 수 없음
        if (actor.getType() == UserType.MANAGER && request.type() == UserType.ADMIN) {
            throw UserErrorCode.ADMIN_ROLE_ASSIGN_DENIED.toException();
        }

        User targetUser = userRepository.findById(targetUserId)
            .orElseThrow(UserErrorCode.USER_NOT_FOUND::toException);

        // MANAGER는 기존 ADMIN의 역할을 변경할 수 없음
        if (actor.getType() == UserType.MANAGER && targetUser.getType() == UserType.ADMIN) {
            throw UserErrorCode.ADMIN_ROLE_ASSIGN_DENIED.toException(
                "MANAGER는 ADMIN 사용자의 역할을 변경할 수 없습니다.");
        }

        targetUser.updateRole(request.type());

        int postCount = (int) postRepository.countByWriterId(targetUserId);
        int commentCount = (int) commentRepository.countByWriterId(targetUserId);

        return AdminUserMapper.toDetail(targetUser, postCount, commentCount);
    }

    // ──────────────────────────────────────────────
    // 유저 강제 삭제
    // ──────────────────────────────────────────────

    @Transactional
    public void deleteUser(Long actorId, Long targetUserId) {
        validateAdminAccess(actorId);
        User actor = getActorById(actorId); // JPA 1차 캐시에서 재사용

        if (actorId.equals(targetUserId)) {
            throw UserErrorCode.SELF_ROLE_CHANGE_DENIED.toException("자신의 계정은 삭제할 수 없습니다.");
        }

        User targetUser = userRepository.findById(targetUserId)
            .orElseThrow(UserErrorCode.USER_NOT_FOUND::toException);

        // MANAGER는 ADMIN을 삭제할 수 없음
        if (actor.getType() == UserType.MANAGER && targetUser.getType() == UserType.ADMIN) {
            throw UserErrorCode.ADMIN_ACCESS_DENIED.toException(
                "MANAGER는 ADMIN 사용자를 삭제할 수 없습니다.");
        }

        userRepository.deleteById(targetUserId);
    }
}

