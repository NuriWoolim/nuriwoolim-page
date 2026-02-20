package com.nuriwoolim.pagebackend.domain.post.service;

import com.nuriwoolim.pagebackend.domain.board.entity.Board;
import com.nuriwoolim.pagebackend.domain.board.entity.BoardType;
import com.nuriwoolim.pagebackend.domain.board.service.BoardService;
import com.nuriwoolim.pagebackend.domain.post.dto.PostCreateRequest;
import com.nuriwoolim.pagebackend.domain.post.dto.PostResponse;
import com.nuriwoolim.pagebackend.domain.post.dto.PostUpdateRequest;
import com.nuriwoolim.pagebackend.domain.post.entity.Post;
import com.nuriwoolim.pagebackend.domain.post.repository.PostRepository;
import com.nuriwoolim.pagebackend.domain.post.util.PostMapper;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.domain.user.service.UserService;
import com.nuriwoolim.pagebackend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

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

        if (postRepository.existsByBoardIdAndTitle(boardId, request.title())){
            throw ErrorCode.POST_TITLE_CONFLICT.toException();
        }

        Post post = PostMapper.fromBoardCreateRequest(request, writer, board);
        Post savedPost = postRepository.save(post);
        return PostMapper.toPostResponse(savedPost);
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getAll(Long boardId){
        return postRepository.findByBoardId(boardId).stream()
                .map(PostMapper::toPostResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Post getPostById(Long boardId, Long postId){ //service layer에서 쓸 함수
        return postRepository.findByIdAndBoardId(postId, boardId).orElseThrow(ErrorCode.DATA_NOT_FOUND::toException);
    }

    @Transactional(readOnly = true)
    public PostResponse getById(Long boardId, Long postId){ //controller에서 쓸 함수
        return PostMapper.toPostResponse(getPostById(boardId, postId));
    }

    @Transactional
    public void deleteById(Long boardId, Long postId, Long actorId){
        Post post = getPostById(boardId, postId);
        validatePostDeletePermission(actorId, post);
        postRepository.delete(post);
    }

    @Transactional
    public PostResponse updateById(Long boardId, Long postId, PostUpdateRequest request, Long actorId){
        Post post = getPostById(boardId, postId);
        validatePostUpdatePermission(actorId, post);

        post.update(request);
        return PostMapper.toPostResponse(post);
    }

    private void validatePermission(Long actorId, BoardType boardType) {
        if (boardType == BoardType.ANNOUNCEMENT && !userService.isAdmin(actorId)) {
            throw ErrorCode.DATA_FORBIDDEN.toException();
        } // 공지는 ADMIN만 작성 가능
    }

    private void validatePostDeletePermission(Long actorId, Post post) {
        if (!post.getWriter().getId().equals(actorId) && !userService.isAdmin(actorId)){
            throw ErrorCode.DATA_FORBIDDEN.toException();
        } // 작성자 & ADMIN은 게시물 삭제 가능
    }

    private void validatePostUpdatePermission(Long actorId, Post post) {
        if (!post.getWriter().getId().equals(actorId)){
            throw ErrorCode.DATA_FORBIDDEN.toException();
        } // 원 작성자만이 게시물 수정 가능
    }
}
