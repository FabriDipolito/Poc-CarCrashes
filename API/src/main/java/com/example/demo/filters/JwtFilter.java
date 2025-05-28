package com.example.demo.filters;

import com.example.demo.entities.User;
import com.example.demo.repositories.UserRepository;
import com.example.demo.utils.CustomHttpServletRequestWrapper;
import com.example.demo.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class JwtFilter extends OncePerRequestFilter {

    private JwtUtil jwtUtil;
    private final UserRepository repository;

    @Autowired
    public JwtFilter(JwtUtil jwtUtil, UserRepository repository) {
        this.jwtUtil = jwtUtil;
        this.repository = repository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String requestURI = request.getRequestURI();

        // Exclude Authentication Routes
        if (requestURI.startsWith("/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        String accessToken = extractTokenFromCookie(request, "accessToken");

        System.out.println("📂 Current working directory: " + System.getProperty("user.dir"));

        if (accessToken != null && jwtUtil.validateToken(accessToken)) {
            String email = jwtUtil.extractEmail(accessToken);
            User user = repository.findByEmail(email);

            if (user != null) {
                if (requestURI.startsWith("/feedback")) {
                    String originalBody = new BufferedReader(new InputStreamReader(request.getInputStream()))
                            .lines().reduce("", (acc, line) -> acc + line);

                    String modifiedBody = originalBody.replaceFirst("\\{", "{\"email\":\"" + email + "\",");

                    HttpServletRequest wrappedRequest = new CustomHttpServletRequestWrapper(request, modifiedBody);
                    filterChain.doFilter(wrappedRequest, response);
                    return;
                }

                filterChain.doFilter(request, response);
                return;
            }
        }

        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType("application/json");
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.getWriter().write("Unauthorized");
    }


    private String extractTokenFromCookie(HttpServletRequest request, String name) {
        if (request.getCookies() == null) return null;
        for (Cookie cookie : request.getCookies()) {
            if (cookie.getName().equals(name)) {
                return cookie.getValue();
            }
        }
        return null;
    }
}

