package com.nuriwoolim.pagebackend.user;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nuriwoolim.pagebackend.domain.user.controller.UserController;
import com.nuriwoolim.pagebackend.domain.user.dto.UserCreateRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.UserUpdateRequest;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.domain.user.entity.UserType;
import com.nuriwoolim.pagebackend.domain.user.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void 사용자를_조회한다() throws Exception {
        // given
        User mockUser = User.builder().id(1L).username("test").email("test@email.com").nickname("test").build();
        when(userService.findById(1L)).thenReturn(mockUser);

        // when & then
        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.username").value("test"))
                .andExpect(jsonPath("$.email").value("test@email.com"))
                .andExpect(jsonPath("$.nickname").value("test"));
    }

    @Test
    void 사용자를_생성한다() throws Exception {
        // given
        UserCreateRequest userCreateRequest = UserCreateRequest.builder()
                .username("username")
                .password("email@email.com")
                .nickname("nickname")
                .build();
        User savedUser = User.of(userCreateRequest);

        when(userService.create(any(UserCreateRequest.class))).thenReturn(savedUser);

        // when & then
        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userCreateRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("username"))
                .andExpect(jsonPath("$.nickname").value("nickname"))
                .andExpect(jsonPath("$.email").value("email@email.com"));
    }

    @Test
    void 사용자를_수정한다() throws Exception {
        // given
        User existing = User.builder().id(1L).nickname("nick").year(0).email("email@email.com").build();
        UserUpdateRequest userUpdateRequest = UserUpdateRequest.builder()
                .nickname("nick2")
                .type(UserType.MEMBER)
                .year(1)
                .password("password2")
                .email("email2@email.com")
                .build();
        User updated = User.builder().id(1L).nickname("nick2").year(1).email("email2@email.com")
                .type(UserType.MEMBER).build();

        when(userService.update(eq(1L), any(UserUpdateRequest.class))).thenReturn(updated);

        // when & then
        mockMvc.perform(patch("/api/users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userUpdateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.nickname").value("nick2"))
                .andExpect(jsonPath("$.type").value("MEMBER"))
                .andExpect(jsonPath("$.year").value(1))
                .andExpect(jsonPath("$.email").value("email2@email.com"));
    }

    @Test
    void 사용자를_삭제한다() throws Exception {
        // when & then
        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isOk());

        verify(userService).delete(1L);
    }
}