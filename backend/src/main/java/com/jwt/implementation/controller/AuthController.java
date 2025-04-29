package com.jwt.implementation.controller;

import com.jwt.implementation.model.AuthRequest;
import com.jwt.implementation.model.User;
import com.jwt.implementation.repository.UserRepository;
import com.jwt.implementation.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import javax.naming.AuthenticationException;
import java.io.Console;
import java.util.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered");

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/check-username")
    public ResponseEntity<?> checkUsername(@RequestParam String username) {
        boolean exists = userRepository.existsByUsername(username);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean exists = userRepository.existsByEmail(email);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register-admin")
    @PreAuthorize("hasRole('ADMIN')") // Only admins can create other admins
    public ResponseEntity<?> registerAdmin(@RequestBody User user) {
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        user.setRole("ADMIN");
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Admin registered");

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        User user = userRepository.findByUsername(request.getUsername());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        if (isAdmin(user)) {
            // Assign the role "ADMIN" if they qualify
            user.setRole("ADMIN");
            userRepository.save(user);
        }

        final String token = jwtUtil.generateToken(user.getUsername(),user.getEmail(),user.getRole());
        return ResponseEntity.ok(Collections.singletonMap("token", token));
    }


    private boolean isAdmin(User user) {
        // Example criteria: Check if the user's email is in a predefined list of admins
        List<String> adminEmails = Arrays.asList("admin1@example.com", "admin2@example.com");

        return adminEmails.contains(user.getEmail());
    }

}

