package com.example.demo.controllers;

import com.example.demo.services.AuthService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/request-code")
    public ResponseEntity<?> requestCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        System.out.println("reached here");
        try {
            service.sendLoginCode(email);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println("❌ Error sending code:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");
        String activeProfile = System.getenv("SPRING_PROFILES_ACTIVE");
        String sameSite = "Strict";
        boolean secure = false;

        if ("prod".equalsIgnoreCase(activeProfile)) {
            sameSite = "None";
            secure = true;
        }
        try {
            Map<String, String> tokens = service.verifyCodeAndGenerateTokens(email, code);
            if (tokens == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

            ResponseCookie accessCookie = ResponseCookie.from("accessToken", tokens.get("accessToken"))
                    .httpOnly(true)
                    .secure(secure)
                    .path("/")
                    .maxAge(Duration.ofMinutes(10))
                    .sameSite(sameSite)
                    .build();

            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", tokens.get("refreshToken"))
                    .httpOnly(true)
                    .secure(secure)
                    .path("/auth")
                    .maxAge(Duration.ofHours(18))
                    .sameSite(sameSite)
                    .build();


            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("accessToken", tokens.get("accessToken"));
            responseBody.put("refreshToken", tokens.get("refreshToken"));

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, accessCookie.toString(), refreshCookie.toString())
                    .body(responseBody);

        } catch (Exception e) {
            System.out.println("❌ Error verifying code:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }



    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@CookieValue(value = "refreshToken", required = false) String refreshToken) {
        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token is missing");
        }

        String newAccessToken = service.refreshAccessTokenFromRefreshToken(refreshToken);
        if (newAccessToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired refresh token");
        }

        ResponseCookie accessCookie = ResponseCookie.from("accessToken", newAccessToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(Duration.ofMinutes(10))
                .sameSite("Strict")
                .build();

        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("accessToken", newAccessToken);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .body(responseBody);
    }
}
