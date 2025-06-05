package com.nuriwoolim.pagebackend.domain.user.controller;

import com.nuriwoolim.pagebackend.domain.user.dto.UserCreateRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.UserResponse;
import com.nuriwoolim.pagebackend.domain.user.dto.UserUpdateRequest;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.domain.user.service.UserService;
import jakarta.validation.Valid;
import java.net.URI;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserController {
    private final UserService userService;

    @GetMapping("/users/{userId}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long userId) {
        return ResponseEntity.ok(UserResponse.of(userService.findById(userId)));
    }

    @PostMapping("/users")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserCreateRequest userCreateRequest) {
        User createdUser = userService.create(userCreateRequest);
        URI location = URI.create("/api/users/" + createdUser.getId());
        return ResponseEntity.created(location)
                .body(UserResponse.of(createdUser));
    }

    @PatchMapping("/users/{userId}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long userId,
                                                   @Valid @RequestBody UserUpdateRequest userUpdateRequest) {
        return ResponseEntity.ok(UserResponse.of(userService.update(userId, userUpdateRequest)));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.delete(userId);
        return ResponseEntity.ok().build();
    }
}
