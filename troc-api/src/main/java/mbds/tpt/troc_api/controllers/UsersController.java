package mbds.tpt.troc_api.controllers;

import mbds.tpt.troc_api.entities.Users;
import mbds.tpt.troc_api.services.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import javax.management.InstanceNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<Page<Users>> getUsers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<Users> users = userService.findUsers(name, role, PageRequest.of(page, size));
        return ResponseEntity.ok(users);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody Users user) {
        try {
            Users newUser = userService.registerUser(user.getUsername(), user.getName(), user.getPassword(),
                    user.getEmail(), user.getPhone(), user.getAddress(), user.getRole());
            return ResponseEntity.ok(newUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

    @PutMapping("/users/{id}/suspend")
    public ResponseEntity<?> suspendUser(@PathVariable Long id) {
        try {
            Users suspendedUser = userService.suspendUser(id);
            return ResponseEntity.ok(suspendedUser);
        } catch (InstanceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }
}
