package com.legaleyes.controller;

import com.legaleyes.service.AuthService;
import com.legaleyes.service.AuthService.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public record RegisterDTO(
            @NotBlank @Email String email,
            @NotBlank @Size(min = 6) String password,
            @NotBlank String fullName,
            @NotBlank String username,
            @NotBlank String profession
    ) {}

    public record LoginDTO(
            @NotBlank @Email String email,
            @NotBlank String password
    ) {}

    // ✅ FIXED FIELD NAME
    public record GoogleRequest(String token) {}

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterDTO req) {
        return ResponseEntity.ok(
                authService.register(
                        new RegisterRequest(
                                req.email().trim(),
                                req.password(),
                                req.fullName().trim(),
                                req.username().trim(),
                                req.profession().trim()
                        )
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginDTO req) {
        return ResponseEntity.ok(
                authService.login(
                        new LoginRequest(
                                req.email().trim(),
                                req.password()
                        )
                )
        );
    }

    // ✅ GOOGLE LOGIN FIXED
    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody GoogleRequest req) {

        if (req.token() == null || req.token().isEmpty()) {
            throw new RuntimeException("Google token is missing");
        }

        return ResponseEntity.ok(
                authService.googleLogin(req.token())
        );
    }

    @GetMapping("/me")
    public ResponseEntity<java.util.Map<String, String>> me(
            @RequestHeader("Authorization") String authHeader) {

        return ResponseEntity.ok(
                java.util.Map.of("status", "authenticated")
        );
    }
}