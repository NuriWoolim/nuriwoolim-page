package com.nuriwoolim.pagebackend.util.seed;

import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.domain.user.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@Profile("seed")
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final UserSeeder userSeeder;
    private final ScheduleSeeder scheduleSeeder;
    private final TimeTableSeeder timeTableSeeder;
    private final ConfigurableApplicationContext context;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("=== 데이터 시딩 시작 ===");

        // 이미 데이터가 있으면 시딩하지 않음
        if (userRepository.count() > 0) {
            log.info("이미 데이터가 존재합니다. 시딩을 건너뜁니다.");
            shutdownApplication();
            return;
        }

        // 1. User 시딩 (100명)
        List<User> users = userSeeder.seed();

        // 2. Schedule 시딩 (1000개 이상, 2026년 전반에 걸쳐)
        scheduleSeeder.seed();

        // 3. TimeTable 시딩 (1000개 이상, 2026년 전반에 걸쳐, 9~22시 사이)
        timeTableSeeder.seed(users);

        log.info("=== 데이터 시딩 완료 ===");

        // 시딩 완료 후 애플리케이션 종료
        shutdownApplication();
    }

    private void shutdownApplication() {
        log.info("애플리케이션을 종료합니다...");
        new Thread(() -> {
            try {
                Thread.sleep(1000); // 로그 출력을 위한 대기
                context.close();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                log.error("애플리케이션 종료 중 오류 발생", e);
            }
        }).start();
    }
}



