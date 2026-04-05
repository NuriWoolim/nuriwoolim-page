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

    private static final String[] COLLEGES = {
        "공과대학", "인문대학", "사회과학대학", "자연과학대학", "경영대학",
        "정보통신대학", "예술대학", "교육대학", "의과대학", "법과대학"
    };

    private static final String[][] MAJORS_BY_COLLEGE = {
        {"컴퓨터공학과", "전자공학과", "기계공학과", "건축공학과"},
        {"국어국문학과", "영어영문학과", "철학과", "사학과"},
        {"사회학과", "정치외교학과", "심리학과", "행정학과"},
        {"수학과", "물리학과", "화학과", "생물학과"},
        {"경영학과", "회계학과", "국제경영학과", "재무학과"},
        {"정보통신공학과", "소프트웨어학과", "데이터사이언스학과", "사이버보안학과"},
        {"미술학과", "음악학과", "디자인학과", "연극영화학과"},
        {"교육학과", "국어교육과", "영어교육과", "수학교육과"},
        {"의학과", "간호학과", "약학과", "치의학과"},
        {"법학과", "법학전문대학원", "공법학과", "사법학과"}
    };

    public List<User> seed() {
        log.info("User 시딩 시작...");

        List<User> users = new ArrayList<>();
        String defaultPassword = passwordEncoder.encode("password123");

        // 각 역할별로 최소 1명씩 보장
        users.add(createUser("admin@nuriwoolim.com", "관리자", UserType.ADMIN, defaultPassword, 2024,
            "20240001", "공과대학", "컴퓨터공학과"));
        users.add(createUser("manager@nuriwoolim.com", "매니저", UserType.MANAGER, defaultPassword, 2023,
            "20230001", "경영대학", "경영학과"));
        users.add(createUser("member@nuriwoolim.com", "회원", UserType.MEMBER, defaultPassword, 2025,
            "20250001", "인문대학", "영어영문학과"));
        users.add(createUser("nonmember@nuriwoolim.com", "비회원", UserType.NONMEMBER, defaultPassword,
            null, null, null, null));

        // 일반유저 100명 랜덤 생성
        for (int i = 1; i <= 100; i++) {
            String name = generateRandomName();
            String email = "user" + i + "@nuriwoolim.com";
            UserType type = UserType.MEMBER;
            Integer year = 2020 + random.nextInt(7); // 2020~2026
            int collegeIdx = random.nextInt(COLLEGES.length);
            String college = COLLEGES[collegeIdx];
            String major = MAJORS_BY_COLLEGE[collegeIdx][random.nextInt(MAJORS_BY_COLLEGE[collegeIdx].length)];
            String studentNumber = year + String.format("%04d", i);

            users.add(createUser(email, name, type, defaultPassword, year, studentNumber, college, major));
        }

        List<User> savedUsers = userRepository.saveAll(users);
        log.info("User {} 명 생성 완료", savedUsers.size());

        return savedUsers;
    }

    private User createUser(String email, String name, UserType type, String password,
        Integer year, String studentNumber, String college, String major) {
        return User.builder()
            .email(email)
            .name(name)
            .type(type)
            .password(password)
            .year(year)
            .studentNumber(studentNumber)
            .college(college)
            .major(major)
            .build();
    }

    private String generateRandomName() {
        return FIRST_NAMES[random.nextInt(FIRST_NAMES.length)] +
            MIDDLE_NAMES[random.nextInt(MIDDLE_NAMES.length)] +
            LAST_NAMES[random.nextInt(LAST_NAMES.length)];
    }
}

