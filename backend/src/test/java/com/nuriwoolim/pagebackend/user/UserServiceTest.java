package com.nuriwoolim.pagebackend.user;

import com.nuriwoolim.pagebackend.user.dto.UserCreateRequest;
import com.nuriwoolim.pagebackend.util.exception.CustomException;
import com.nuriwoolim.pagebackend.util.exception.ErrorCode;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Test
    @DisplayName("유저 Read -> 성공")
    public void findUserById() {
        User user = new User();
        user.setId(1L);
        user.setUsername("username");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        User findUser = userService.findById(1L);

        assertThat(findUser).isEqualTo(user);
        assertThat(findUser.getUsername()).isEqualTo("username");
        assertThat(findUser.getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("유저 Read -> 실패: 존재하지 않는 회원")
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
        UserCreateRequest userCreateRequest = new UserCreateRequest();
        userCreateRequest.setUsername("username");
        userCreateRequest.setPassword("password");
        userCreateRequest.setEmail("email@email.com");
        userCreateRequest.setNickname("nickname");

        User user = User.of(userCreateRequest);

        when(userRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        User savedUser = userService.create(userCreateRequest);

        assertThat(savedUser).usingRecursiveComparison().isEqualTo(user);
    }
}