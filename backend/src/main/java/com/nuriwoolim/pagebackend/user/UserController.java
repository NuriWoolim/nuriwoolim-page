package com.nuriwoolim.pagebackend.user;

import com.nuriwoolim.pagebackend.user.dto.UserCreateRequest;
import com.nuriwoolim.pagebackend.user.dto.UserUpdateRequest;
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

import java.net.URI;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserController {
    private final UserService userService;

    @GetMapping("/users/{userId}")
    public ResponseEntity<User> getUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.findById(userId));
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody UserCreateRequest userCreateRequest) {
        User createdUser = userService.create(userCreateRequest);
        URI location = URI.create("/api/users/" + createdUser.getId());
        return ResponseEntity.created(location)
                .body(createdUser);
    }

    @PatchMapping("/users/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable Long userId, @RequestBody UserUpdateRequest userUpdateRequest) {
        return ResponseEntity.ok(userService.update(userId, userUpdateRequest));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.delete(userId);
        return ResponseEntity.ok().build();
    }
}
