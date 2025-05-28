package com.example.demo.repositories;

import com.example.demo.entities.Feedback;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

@Repository
public class FeedbackRepository {

    @Autowired
    private DataSource dataSource;

    @Autowired
    public FeedbackRepository() {
    }

    public void save(Feedback feedback) {
        String query = "INSERT INTO feedback (email, message) VALUES (?, ?)";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setString(1, feedback.getEmail());
            pstmt.setString(2, feedback.getMessage());
            pstmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
