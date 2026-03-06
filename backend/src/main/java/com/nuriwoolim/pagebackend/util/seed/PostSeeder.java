package com.nuriwoolim.pagebackend.util.seed;

import com.nuriwoolim.pagebackend.domain.board.entity.Board;
import com.nuriwoolim.pagebackend.domain.post.entity.Post;
import com.nuriwoolim.pagebackend.domain.post.entity.PostType;
import com.nuriwoolim.pagebackend.domain.post.repository.PostRepository;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PostSeeder {

    private final PostRepository postRepository;
    private final Random random = new Random();

    private static final String[] POST_TITLES = {
        "첫 게시글입니다", "환영합니다", "질문있어요", "이번 공연 후기",
        "합주실 사용 문의", "악기 추천 부탁드립니다", "정기공연 안내",
        "MT 장소 투표", "신입생 환영회", "중간고사 기간 공지",
        "방학 연습 일정", "회비 납부 안내", "사진 공유합니다",
        "곡 추천해주세요", "동방 청소 당번", "장비 고장 신고",
        "공연 섭외 들어왔어요", "졸업 공연 준비", "신입 모집 공고",
        "정기 총회 안내"
    };

    private static final String[] POST_CONTENT_TEMPLATES = {
        "안녕하세요. %s에 대해 공유드립니다.\n\n자세한 내용은 다음과 같습니다.\n1. 첫 번째 내용\n2. 두 번째 내용\n3. 세 번째 내용\n\n많은 참여 부탁드립니다!",
        "%s 관련하여 글을 남깁니다.\n\n개인적인 의견으로는 이렇게 진행하면 좋을 것 같습니다.\n\n여러분의 생각은 어떠신가요?",
        "%s에 대한 질문입니다.\n\n혹시 아시는 분 계신가요?\n댓글로 알려주시면 감사하겠습니다.",
        "안녕하세요!\n\n%s에 대해 이야기하고 싶어서 글을 작성합니다.\n정말 좋았던 것 같아요.\n\n다들 어떻게 생각하시나요?",
        "%s 공지드립니다.\n\n일시: 추후 공지\n장소: 동아리방\n준비물: 없음\n\n필참 부탁드립니다!",
        "제목 그대로 %s입니다.\n\n자세한 사항은 운영진에게 문의해주세요.\n감사합니다.",
        "%s 후기 남깁니다.\n\n정말 즐거운 시간이었어요.\n다음에 또 이런 기회가 있었으면 좋겠습니다.\n\n수고하신 모든 분들께 감사드립니다!"
    };

    public List<Post> seed(List<Board> boards, List<User> users) {
        log.info("Post 시딩 시작...");

        List<Post> posts = new ArrayList<>();
        PostType[] postTypes = PostType.values();
        int postCounter = 0;

        // 각 Board당 50~150개의 Post 생성 (총 약 1000개)
        for (Board board : boards) {
            int postCount = 50 + random.nextInt(101); // 50 to 150

            for (int i = 0; i < postCount; i++) {
                postCounter++;
                String baseTitle = POST_TITLES[random.nextInt(POST_TITLES.length)];
                // Ensure title is unique and within 20 character limit
                String title = "Post-" + postCounter;

                String contentTemplate = POST_CONTENT_TEMPLATES[random.nextInt(
                    POST_CONTENT_TEMPLATES.length)];
                String content = String.format(contentTemplate, baseTitle);

                PostType postType = postTypes[random.nextInt(postTypes.length)];
                User writer = users.get(random.nextInt(users.size()));

                posts.add(Post.builder()
                    .title(title)
                    .content(content)
                    .type(postType)
                    .writer(writer)
                    .board(board)
                    .build());
            }
        }

        List<Post> savedPosts = postRepository.saveAll(posts);
        log.info("Post {} 개 생성 완료", savedPosts.size());

        return savedPosts;
    }
}

