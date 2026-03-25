package com.nuriwoolim.pagebackend.util.seed;

import com.nuriwoolim.pagebackend.domain.board.entity.Board;
import com.nuriwoolim.pagebackend.domain.board.entity.BoardType;
import com.nuriwoolim.pagebackend.domain.board.repository.BoardRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class BoardSeeder {

    private final BoardRepository boardRepository;

    private static final String[] BOARD_TITLES = {
        "공지사항", "자유게시판", "질문게시판", "정보공유", "후기게시판",
        "건의사항", "합주후기", "공연소식", "신입생게시판", "졸업생게시판"
    };

    private static final String[] BOARD_DESCRIPTIONS = {
        "동아리 공지사항을 확인하세요", "자유롭게 소통하는 공간입니다",
        "궁금한 점을 물어보세요", "유용한 정보를 공유해주세요",
        "다양한 후기를 나눠주세요", "동아리 발전을 위한 건의사항",
        "합주 후기를 공유하세요", "공연 관련 소식", "신입생 전용 게시판",
        "졸업생 교류 게시판"
    };

    public List<Board> seed() {
        log.info("Board 시딩 시작...");

        List<Board> boards = new ArrayList<>();
        BoardType[] boardTypes = BoardType.values();

        for (int i = 0; i < BOARD_TITLES.length; i++) {
            boards.add(Board.builder()
                .title(BOARD_TITLES[i])
                .description(BOARD_DESCRIPTIONS[i])
                .type(boardTypes[i % boardTypes.length])
                .build());
        }

        List<Board> savedBoards = boardRepository.saveAll(boards);
        log.info("Board {} 개 생성 완료", savedBoards.size());

        return savedBoards;
    }
}

