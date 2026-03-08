package com.nuriwoolim.pagebackend.util.seed;

import com.nuriwoolim.pagebackend.domain.comment.entity.Comment;
import com.nuriwoolim.pagebackend.domain.comment.repository.CommentRepository;
import com.nuriwoolim.pagebackend.domain.post.entity.Post;
import com.nuriwoolim.pagebackend.domain.post.entity.PostType;
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
public class CommentSeeder {

	private final CommentRepository commentRepository;
	private final Random random = new Random();

	private static final String[] COMMENT_CONTENTS = {
		"좋은 글이네요! 감사합니다.",
		"이 부분에 대해 더 궁금한 점이 있는데 설명해주실 수 있나요?",
		"동의합니다. 저도 같은 생각이에요.",
		"정보 공유 감사합니다!",
		"저도 참여하고 싶습니다!",
		"일정 확인했습니다. 감사합니다.",
		"혹시 장소가 변경될 수도 있나요?",
		"준비물 챙겨야겠네요!",
		"수고하셨습니다!",
		"다음에도 이런 행사 많이 해주세요!",
		"저는 참석이 어려울 것 같아요 ㅠㅠ",
		"멋진 후기네요! 부러워요.",
		"공연 기대됩니다!",
		"같이 연습하실 분 계신가요?",
		"연락 부탁드립니다!",
		"좋은 정보 감사합니다. 공유해도 될까요?",
		"ㅋㅋㅋ 재밌네요",
		"수고 많으셨습니다!",
		"다음 모임은 언제인가요?",
		"확인했습니다!"
	};

	public List<Comment> seed(List<Post> posts, List<User> users) {
		log.info("Comment 시딩 시작...");

		List<Comment> comments = new ArrayList<>();

		// 각 Post당 0~10개의 Comment 생성
		for (Post post : posts) {
			int commentCount = random.nextInt(11); // 0 to 10

			for (int i = 0; i < commentCount; i++) {
				String content = COMMENT_CONTENTS[random.nextInt(COMMENT_CONTENTS.length)];
				User writer = users.get(random.nextInt(users.size()));

				comments.add(Comment.builder()
					.content(content)
					.writer(writer)
					.post(post)
					.build());
			}
		}

		List<Comment> savedComments = commentRepository.saveAll(comments);
		log.info("Comment {} 개 생성 완료", savedComments.size());

		return savedComments;
	}
}

