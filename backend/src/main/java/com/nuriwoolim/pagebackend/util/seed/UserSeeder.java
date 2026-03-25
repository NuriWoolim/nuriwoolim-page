package com.nuriwoolim.pagebackend.util.seed;

import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.domain.user.entity.UserType;
import com.nuriwoolim.pagebackend.domain.user.repository.UserRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserSeeder {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Random random = new Random();

    private static final String[] FIRST_NAMES = {
        "김", "이", "박", "최", "정", "강", "조", "윤", "장", "임",
        "한", "오", "서", "신", "권", "황", "안", "송", "류", "홍"
    };

    private static final String[] MIDDLE_NAMES = {
        "서", "민", "지", "예", "하", "수", "도", "시", "현", "영",
        "준", "성", "진", "승", "태", "우", "정", "은", "경", "희"
    };

    private static final String[] LAST_NAMES = {
        "준", "윤", "아", "은", "진", "호", "빈", "현", "우", "민",
        "서", "영", "하", "지", "수", "연", "주", "혁", "원", "훈"
    };

    public List<User> seed() {
        log.info("User 시딩 시작...");

        List<User> users = new ArrayList<>();
        String defaultPassword = passwordEncoder.encode("password123");

        // 각 역할별로 최소 1명씩 보장
        users.add(createUser("admin@nuriwoolim.com", "관리자", UserType.ADMIN, defaultPassword, 2024));
        users.add(
            createUser("manager@nuriwoolim.com", "매니저", UserType.MANAGER, defaultPassword, 2023));
        users.add(
            createUser("member@nuriwoolim.com", "회원", UserType.MEMBER, defaultPassword, 2025));
        users.add(createUser("nonmember@nuriwoolim.com", "비회원", UserType.NONMEMBER, defaultPassword,
            null));

        // 일반유저 100명 랜덤 생성
        for (int i = 1; i <= 100; i++) {
            String name = generateRandomName();
            String email = "user" + i + "@nuriwoolim.com";
            UserType type = UserType.MEMBER;
            Integer year = 2020 + random.nextInt(7); // 2020~2026

            users.add(createUser(email, name, type, defaultPassword, year));
        }

        List<User> savedUsers = userRepository.saveAll(users);
        log.info("User {} 명 생성 완료", savedUsers.size());

        return savedUsers;
    }

    private User createUser(String email, String name, UserType type, String password,
        Integer year) {
        return User.builder()
            .email(email)
            .name(name)
            .type(type)
            .password(password)
            .year(year)
            .build();
    }

    private String generateRandomName() {
        return FIRST_NAMES[random.nextInt(FIRST_NAMES.length)] +
            MIDDLE_NAMES[random.nextInt(MIDDLE_NAMES.length)] +
            LAST_NAMES[random.nextInt(LAST_NAMES.length)];
    }
}

