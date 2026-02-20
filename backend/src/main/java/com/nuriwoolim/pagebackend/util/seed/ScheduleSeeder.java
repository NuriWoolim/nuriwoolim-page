package com.nuriwoolim.pagebackend.util.seed;

import com.nuriwoolim.pagebackend.domain.schedule.entity.Schedule;
import com.nuriwoolim.pagebackend.domain.schedule.repository.ScheduleRepository;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ScheduleSeeder {

    private final ScheduleRepository scheduleRepository;
    private final Random random = new Random();

    private static final String[] SCHEDULE_TITLES = {
        "전체 회의", "팀 미팅", "워크샵", "세미나", "축제 준비", "공연 연습",
        "MT", "총회", "임원진 회의", "신입생 환영회", "송년회", "신년회",
        "정기공연", "특별공연", "연주회", "발표회", "오디션", "리허설"
    };

    private static final String[] SCHEDULE_DESCRIPTIONS = {
        "정기 모임입니다", "중요한 일정입니다", "필참 부탁드립니다",
        "자유 참석입니다", "간식 준비됩니다", "출석 체크 있습니다",
        "드레스코드: 편한 복장", "준비물 필요", null, null
    };

    private static final String[] SCHEDULE_COLORS = {
        "FF6B6B", "4ECDC4", "45B7D1", "FFA07A", "98D8C8",
        "F7DC6F", "BB8FCE", "85C1E2", "F8B739", "52B788"
    };

    public List<Schedule> seed() {
        log.info("Schedule 시딩 시작...");

        List<Schedule> schedules = new ArrayList<>();
        LocalDate startDate = LocalDate.of(2026, 1, 1);
        LocalDate endDate = LocalDate.of(2026, 12, 31);

        // 2026년 전반에 걸쳐 1200개 스케줄 생성
        for (int i = 0; i < 1200; i++) {
            LocalDate randomDate = generateRandomDate(startDate, endDate);
            String title = SCHEDULE_TITLES[random.nextInt(SCHEDULE_TITLES.length)];
            String description = SCHEDULE_DESCRIPTIONS[random.nextInt(
                SCHEDULE_DESCRIPTIONS.length)];
            String color = SCHEDULE_COLORS[random.nextInt(SCHEDULE_COLORS.length)];

            schedules.add(Schedule.builder()
                .title(i + "-" + title)
                .description(i + "-" + description)
                .color(color)
                .date(randomDate)
                .build());
        }

        List<Schedule> savedSchedules = scheduleRepository.saveAll(schedules);
        log.info("Schedule {} 개 생성 완료", savedSchedules.size());

        return savedSchedules;
    }

    private LocalDate generateRandomDate(LocalDate start, LocalDate end) {
        long daysBetween = end.toEpochDay() - start.toEpochDay();
        long randomDays = random.nextInt((int) daysBetween + 1);
        return start.plusDays(randomDays);
    }
}

