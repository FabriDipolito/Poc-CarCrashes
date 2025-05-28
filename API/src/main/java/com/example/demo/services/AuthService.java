package com.example.demo.services;

import com.example.demo.entities.User;
import com.example.demo.repositories.UserRepository;
import com.example.demo.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class AuthService {

    private final UserRepository repository;
    private final JwtUtil jwtUtil;
    private final JavaMailSender mailSender;

    private final Map<String, String> codes = new HashMap<>();
    private final Random random = new Random();

    @Autowired
    public AuthService(UserRepository repository, JwtUtil jwtUtil, JavaMailSender mailSender) {
        this.repository = repository;
        this.jwtUtil = jwtUtil;
        this.mailSender = mailSender;
    }

    public void sendLoginCode(String email) {
        String code = String.format("%06d", random.nextInt(1_000_000));
        codes.put(email, code);

        String subject = "Your access Code";
        String body = String.format("""
                Hello 👋,

                Your access code is: %s

                Enter it in the app to continue.
                This code will expire soon for security reasons.

                Best regards,
                The Authentication Team 💼 (Fabricio 😎)
                """, code);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);

        System.out.println("✅ Code sent to: " + email);
    }

    public Map<String, String> verifyCodeAndGenerateTokens(String email, String inputCode) {
        String realCode = codes.get(email);
        if (realCode == null || !realCode.equals(inputCode)) {
            return null;
        }

        User user = repository.findByEmail(email);
        if (user == null) {
            user = new User(email, 1, 1);
            repository.save(user);
        } else {
            user.setAccessJwtTimes(user.getAccessJwtTimes() + 1);
            user.setRefreshJwtTimes(user.getRefreshJwtTimes() + 1);
            repository.update(user);
        }

        String accessToken = jwtUtil.generateAccessToken(email);
        String refreshToken = jwtUtil.generateRefreshToken(email);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);
        return tokens;
    }

    public String refreshAccessTokenFromRefreshToken(String refreshToken) {
        if (!jwtUtil.validateToken(refreshToken)) {
            return null;
        }

        String email = jwtUtil.extractEmail(refreshToken);
        User user = repository.findByEmail(email);
        if (user == null) {
            return null;
        }

        user.setAccessJwtTimes(user.getAccessJwtTimes() + 1);
        repository.update(user);

        return jwtUtil.generateAccessToken(email);
    }


}


