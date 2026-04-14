package com.legaleyes.service;

import com.legaleyes.model.User;
import com.legaleyes.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public record RegisterRequest(
            String email,
            String password,
            String fullName,
            String username,
            String profession
    ) {}

    public record AuthResponse(
            String token,
            String userId,
            String email,
            String fullName,
            String username,
            String profession
    ) {}

    public record LoginRequest(String email, String password) {}

    // ✅ REGISTER
    public AuthResponse register(RegisterRequest req) {

        String email = req.email().toLowerCase().trim();
        String username = req.username().toLowerCase().trim();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }

        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already taken");
        }

        User user = User.builder()
                .email(email)
                .username(username)
                .passwordHash(passwordEncoder.encode(req.password()))
                .fullName(req.fullName().trim())
                .profession(req.profession().trim())
                .build();

        userRepository.save(user);

        return new AuthResponse(
                jwtService.generateToken(user.getEmail()),
                String.valueOf(user.getId()),
                user.getEmail(),
                user.getFullName(),
                user.getUsername(),
                user.getProfession()
        );
    }

    // ✅ LOGIN
    public AuthResponse login(LoginRequest req) {

        String email = req.email().toLowerCase().trim();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return new AuthResponse(
                jwtService.generateToken(user.getEmail()),
                String.valueOf(user.getId()),
                user.getEmail(),
                user.getFullName(),
                user.getUsername(),
                user.getProfession()
        );
    }

    // ✅ GOOGLE LOGIN FIXED
    public AuthResponse googleLogin(String idToken) {

        if (idToken == null || idToken.isEmpty()) {
            throw new RuntimeException("Google token is missing");
        }

        String email = jwtService.verifyGoogleToken(idToken)
                .toLowerCase()
                .trim();

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .email(email)
                            .username(email.split("@")[0])
                            .passwordHash("")
                            .fullName("Google User")
                            .profession("Other")
                            .build();

                    return userRepository.save(newUser);
                });

        return new AuthResponse(
                jwtService.generateToken(user.getEmail()),
                String.valueOf(user.getId()),
                user.getEmail(),
                user.getFullName(),
                user.getUsername(),
                user.getProfession()
        );
    }
}