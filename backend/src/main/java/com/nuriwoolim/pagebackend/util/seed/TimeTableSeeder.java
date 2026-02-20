package com.nuriwoolim.pagebackend.util.seed;

import com.nuriwoolim.pagebackend.domain.timeTable.entity.TimeTable;
import com.nuriwoolim.pagebackend.domain.timeTable.repository.TimeTableRepository;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TimeTableSeeder {

    private final TimeTableRepository timeTableRepository;
    private final Random random = new Random();

    private static final String[] TIMETABLE_TITLES = {
        "정규팀 합주", "운영진 합주", "자유팀 합주", "자유팀 심사", "동방 사용 금지"
    };

    private static final String[] TEAMS = {
        "골아팠억", "지지하세요", "돌 보다 여자", "Ain`t about jazz", "놀이올림",
        "에이유", "조조합주실", "실리가글", "너화서기자나", "팀명 어렵네"
    };

    private static final String[] TIMETABLE_DESCRIPTIONS = {
        "정기 연습 일정입니다", "집중 연습이 필요합니다", "자유 연습 시간입니다",
        "강사님과 함께합니다", "발표 준비", "공연 준비", null, null
    };

    private static final String[] COLORS = {
        "FF6B6B", "4ECDC4", "45B7D1", "FFA07A", "98D8C8",
        "F7DC6F", "BB8FCE", "85C1E2", "F8B739", "52B788"
    };

    public List<TimeTable> seed(List<User> users) {
        log.info("TimeTable 시딩 시작...");

        List<TimeTable> timeTables = new ArrayList<>();
        LocalDate currentDate = LocalDate.of(2026, 1, 1);
        LocalDate endDate = LocalDate.of(2026, 12, 31);

        // 시작 시간을 9시로 초기화 (monotonic 시작점)
        LocalDateTime currentDateTime = LocalDateTime.of(currentDate, LocalTime.of(9, 0));

        int count = 0;
        int targetCount = 3000;
        int i = 0;
        // 2026년 전반에 걸쳐 최대 3000개 타임테이블을 겹치지 않게 순차적으로 생성
        while (count < targetCount && !currentDate.isAfter(endDate)) {
            i++;
            // 1시간 또는 2시간 duration
            int duration = random.nextBoolean() ? 1 : 2;

            LocalDateTime start = currentDateTime;
            LocalDateTime end = start.plusHours(duration);

            // 종료 시간이 22시를 넘으면 다음 날 9시로 이동
            if (end.getHour() > 22 || (end.getHour() == 22 && end.getMinute() > 0)) {
                currentDate = currentDate.plusDays(1);
                if (currentDate.isAfter(endDate)) {
                    break;
                }
                currentDateTime = LocalDateTime.of(currentDate, LocalTime.of(9, 0));
                continue;
            }

            String title = TIMETABLE_TITLES[random.nextInt(TIMETABLE_TITLES.length)];
            String team = TEAMS[random.nextInt(TEAMS.length)];
            String description = TIMETABLE_DESCRIPTIONS[random.nextInt(
                TIMETABLE_DESCRIPTIONS.length)];
            String color = COLORS[random.nextInt(COLORS.length)];
            User user = users.get(random.nextInt(users.size()));

            timeTables.add(TimeTable.builder()
                .title(i + "-" + title)
                .team(i + "-" + team)
                .description(i + "-" + description)
                .color(color)
                .start(start)
                .end(end)
                .user(user)
                .build());

            // 다음 타임테이블 시작 시간은 현재 종료 시간 + 랜덤 간격(0~3시간)
            int gap = random.nextInt(4); // 0, 1, 2, 3시간 중 랜덤
            currentDateTime = end.plusHours(gap);
            count++;

            // 간격 추가 후 시간이 22시를 넘으면 다음 날 9시로 이동
            if (currentDateTime.getHour() >= 22) {
                currentDate = currentDate.plusDays(1);
                if (currentDate.isAfter(endDate)) {
                    break;
                }
                currentDateTime = LocalDateTime.of(currentDate, LocalTime.of(9, 0));
            }
        }

        List<TimeTable> savedTimeTables = timeTableRepository.saveAll(timeTables);
        log.info("TimeTable {} 개 생성 완료 (목표: {})", savedTimeTables.size(), targetCount);

        return savedTimeTables;
    }
}

