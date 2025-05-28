package com.example.demo.services;

import com.example.demo.entities.Feedback;
import com.example.demo.repositories.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class FeedbackService {
    private final FeedbackRepository repository;
    private final JavaMailSender mailSender;

    @Autowired
    public FeedbackService(FeedbackRepository repository, JavaMailSender mailSender) {
        this.repository = repository;
        this.mailSender = mailSender;
    }

    public void saveFeedback(String email, String message) {
        Feedback feedback = new Feedback(email, message);

        String subject = "Feedback de " + email;
        String body = String.format("Email: %s\n\nFeedback:\n%s", email, message);

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo("fdipolito@correo.um.edu.uy");
        mail.setSubject(subject);
        mail.setText(body);
        mailSender.send(mail);

        repository.save(feedback);
    }
}