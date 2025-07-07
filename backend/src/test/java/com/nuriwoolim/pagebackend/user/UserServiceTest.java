package com.nuriwoolim.pagebackend.user;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.nuriwoolim.pagebackend.domain.user.dto.UserCreateRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.UserResponse;
import com.nuriwoolim.pagebackend.domain.user.dto.UserUpdateRequest;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.domain.user.entity.UserType;
import com.nuriwoolim.pagebackend.domain.user.repository.UserRepository;
import com.nuriwoolim.pagebackend.domain.user.service.UserService;
import com.nuriwoolim.pagebackend.domain.user.util.UserMapper;
import com.nuriwoolim.pagebackend.global.exception.CustomException;
import com.nuriwoolim.pagebackend.global.exception.ErrorCode;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@DisplayName("UserService")
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Test
    @DisplayName("유저 Read -> 성공")
    public void findUserById() {
        User user = User.builder().id(1L).username("username").build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        UserResponse findUser = userService.findById(1L);

        assertThat(findUser.username()).isEqualTo("username");
        assertThat(findUser.id()).isEqualTo(1L);
    }

    @Test
    @DisplayName("findById-실패: 존재하지 않는 회원")
    public void findUserByIdFailure() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        assertThatThrownBy(() ->
                userService.findById(1L))
                .isInstanceOf(CustomException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.USER_NOT_FOUND);


    }

    @Test
    @DisplayName("유저 Create -> 성공")
    public void createUser() {
        UserCreateRequest userCreateRequest = UserCreateRequest.builder()
                .username("username")
                .password("password")
                .email("email@email.com")
                .nickname("nickname")
                .build();

        User user = UserMapper.fromUserCreateRequest(userCreateRequest, userCreateRequest.password());

        when(userRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        UserResponse savedUser = userService.create(user);

        assertThat(savedUser).usingRecursiveComparison().isEqualTo(UserMapper.toUserResponse(user));
    }

    @Test
    @DisplayName("delete-성공")
    public void deleteUserById() {
        userService.delete(1L);
        verify(userRepository).deleteById(1L);
    }

    @Test
    @DisplayName("update")
    public void update() {
        // given
        User existing = User.builder().id(1L).nickname("nick").year(0).password("password").email("email@email.com")
                .build();
        UserUpdateRequest userUpdateRequest = UserUpdateRequest.builder()
                .nickname("nick2")
                .type(UserType.MEMBER)
                .year(1)
                .password("password2")
                .email("email2@email.com")
                .build();
        User updated = User.builder().id(1L).nickname("nick2").year(1).password("password2").email("email2@email.com")
                .type(UserType.MEMBER).build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(existing));

        // when
        UserResponse result = userService.update(1L, userUpdateRequest);

        // then
        assertThat(result).usingRecursiveComparison().isEqualTo(UserMapper.toUserResponse(updated));
    }
}