package com.example.demo.repositories;

import com.example.demo.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;

@Repository
public class UserRepository {
    @Autowired
    private DataSource dataSource;

    public UserRepository() {
    }

    public User findByEmail(String email) {
        String query = "SELECT * FROM users WHERE email = ?";
        try (Connection conn = dataSource.getConnection()) {
            System.out.println("🔎 Connected to DB: " + conn.getMetaData().getURL());

            try (PreparedStatement pstmt = conn.prepareStatement(query)) {
                pstmt.setString(1, email);
                ResultSet rs = pstmt.executeQuery();
                if (rs.next()) {
                    return new User(
                            rs.getString("email"),
                            rs.getInt("access_jwt_times"),
                            rs.getInt("refresh_jwt_times")
                    );
                }
            }
        } catch (SQLException e) {
            System.out.println("❌ Error when connecting to DB");
            e.printStackTrace();
        }
        return null;
    }

    public void save(User user) {
        String query = "INSERT INTO users (email, access_jwt_times, refresh_jwt_times) VALUES (?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setString(1, user.getEmail());
            pstmt.setInt(2, user.getAccessJwtTimes());
            pstmt.setInt(3, user.getRefreshJwtTimes());
            pstmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void update(User user) {
        String query = "UPDATE users SET access_jwt_times = ?, refresh_jwt_times = ? WHERE email = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setInt(1, user.getAccessJwtTimes());
            pstmt.setInt(2, user.getRefreshJwtTimes());
            pstmt.setString(3, user.getEmail());
            pstmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}

