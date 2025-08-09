package com.nuriwoolim.pagebackend.user;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.nuriwoolim.pagebackend.domain.user.dto.UserResponse;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.domain.user.repository.UserRepository;
import com.nuriwoolim.pagebackend.domain.user.service.UserService;
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
        User user = User.builder().id(1L).name("username").build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        UserResponse findUser = userService.findById(1L);

        assertThat(findUser.name()).isEqualTo("username");
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
    @DisplayName("delete-성공")
    public void deleteUserById() {
        userService.delete(1L);
        verify(userRepository).deleteById(1L);
    }
}