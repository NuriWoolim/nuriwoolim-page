package com.nuriwoolim.pagebackend.user;

import com.nuriwoolim.pagebackend.user.dto.UserCreateRequest;
import com.nuriwoolim.pagebackend.user.dto.UserUpdateRequest;
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
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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
        User findUser = userService.findById(1L);

        assertThat(findUser).isEqualTo(user);
        assertThat(findUser.getUsername()).isEqualTo("username");
        assertThat(findUser.getId()).isEqualTo(1L);
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
        User existing = User.builder().id(1L).nickname("nick").year(0).password("password").email("email@email.com").build();
        UserUpdateRequest userUpdateRequest = new UserUpdateRequest();
        userUpdateRequest.setId(1L);
        userUpdateRequest.setNickname("nick2");
        userUpdateRequest.setType(UserType.MEMBER);
        userUpdateRequest.setYear(1);
        userUpdateRequest.setPassword("password2");
        userUpdateRequest.setEmail("email2@email.com");
        User updated = User.builder().id(1L).nickname("nick2").year(1).password("password2").email("email2@email.com")
                .type(UserType.MEMBER).build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(userRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        // when
        User result = userService.update(userUpdateRequest);

        // then
        assertThat(result).usingRecursiveComparison().isEqualTo(updated);
    }
}