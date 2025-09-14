package com.nuriwoolim.pagebackend.domain.post.service;

import com.nuriwoolim.pagebackend.domain.board.dto.BoardResponse;
import com.nuriwoolim.pagebackend.domain.board.entity.Board;
import com.nuriwoolim.pagebackend.domain.board.entity.BoardType;
import com.nuriwoolim.pagebackend.domain.board.service.BoardService;
import com.nuriwoolim.pagebackend.domain.board.util.BoardMapper;
import com.nuriwoolim.pagebackend.domain.post.dto.PostCreateRequest;
import com.nuriwoolim.pagebackend.domain.post.dto.PostResponse;
import com.nuriwoolim.pagebackend.domain.post.entity.Post;
import com.nuriwoolim.pagebackend.domain.post.entity.PostType;
import com.nuriwoolim.pagebackend.domain.post.repository.PostRepository;
import com.nuriwoolim.pagebackend.domain.post.util.PostMapper;
import com.nuriwoolim.pagebackend.domain.user.dto.UserResponse;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.domain.user.service.UserService;
import com.nuriwoolim.pagebackend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final UserService userService;
    private final BoardService boardService;

    @Transactional
    public PostResponse create(Long boardId, PostCreateRequest request, Long actorId) {
        User writer = userService.getUserById(actorId);
        Board board  = boardService.getBoardById(boardId);

        validatePermission(actorId, board.getType());

        Post post = PostMapper.fromBoardCreateRequest(request, writer, board);
        Post savedPost = postRepository.save(post);
        return PostMapper.toPostResponse(savedPost);
    }

    private void validatePermission(Long actorId, BoardType boardType) {
        if (boardType == BoardType.ANNOUNCEMENT && !userService.isAdmin(actorId)) {
            throw ErrorCode.DATA_FORBIDDEN.toException();
        }
    }
}
