package com.nuriwoolim.pagebackend.domain.user.dto;

import lombok.Builder;

@Builder
public record AdminDashboardResponse(
    int totalUsers,
    int adminCount,
    int managerCount,
    int memberCount,
    int nonMemberCount,
    int totalPosts,
    int totalComments,
    int totalSchedules
) {
}

