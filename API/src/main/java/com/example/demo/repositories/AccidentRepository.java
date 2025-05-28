package com.example.demo.repositories;

import com.example.demo.DTO.PaginatedResults;
import com.example.demo.entities.Accident;
import com.example.demo.entities.AccidentId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.*;

@Repository
public class AccidentRepository {

    @Autowired
    private DataSource dataSource;

    public AccidentRepository() {
    }

    public List<Accident> findAll() {
        List<Accident> accidents = new ArrayList<>();
        String query = "SELECT * FROM accidents";

        try (Connection conn = dataSource.getConnection()) {

            DatabaseMetaData metaData = conn.getMetaData();
            ResultSet tables = metaData.getTables(null, null, "%", new String[]{"TABLE"});
            System.out.println("Tables in the DB:");
            while (tables.next()) {
                System.out.println("Table: " + tables.getString("TABLE_NAME"));
            }

            try (PreparedStatement pstmt = conn.prepareStatement(query);
                 ResultSet rs = pstmt.executeQuery()) {

                while (rs.next()) {
                    Accident accident = new Accident();
                    AccidentId accidentId = new AccidentId(
                            rs.getLong("case_id"),
                            rs.getString("year")
                    );
                    accident.setId(accidentId);
                    accident.setState(rs.getInt("state"));
                    accident.setCrashDate(rs.getString("crash_date"));
                    accident.setStateName(rs.getString("state_name"));
                    accident.setCountyName(rs.getString("county_name"));
                    accident.setTotalVehicles(rs.getInt("total_vehicles"));
                    accident.setFatals(rs.getInt("fatals"));
                    accident.setPersons(rs.getInt("persons"));
                    accident.setPeds(rs.getInt("peds"));

                    accidents.add(accident);
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return accidents;
    }

    public PaginatedResults<Accident> findByStateAndCrashDateBetween(int state, String startDate, String endDate, int page, int size) {
        List<Accident> accidents = new ArrayList<>();
        String query = "SELECT * FROM accidents WHERE state = ? AND crash_date BETWEEN ? AND ? LIMIT ? OFFSET ?";
        String countQuery = "SELECT COUNT(*) FROM accidents WHERE state = ? AND crash_date BETWEEN ? AND ?";
        int totalCount = 0;

        try (Connection conn = dataSource.getConnection()) {
            try (PreparedStatement countStmt = conn.prepareStatement(countQuery)) {
                countStmt.setInt(1, state);
                countStmt.setString(2, startDate);
                countStmt.setString(3, endDate);
                try (ResultSet rs = countStmt.executeQuery()) {
                    if (rs.next()) {
                        totalCount = rs.getInt(1);
                    }
                }
            }

            try (PreparedStatement pstmt = conn.prepareStatement(query)) {
                pstmt.setInt(1, state);
                pstmt.setString(2, startDate);
                pstmt.setString(3, endDate);
                pstmt.setInt(4, size);
                pstmt.setInt(5, page * size);
                try (ResultSet rs = pstmt.executeQuery()) {
                    while (rs.next()) {
                        Accident accident = new Accident();
                        AccidentId accidentId = new AccidentId(
                                rs.getLong("case_id"),
                                rs.getString("year")
                        );
                        accident.setId(accidentId);
                        accident.setState(rs.getInt("state"));
                        accident.setCrashDate(rs.getString("crash_date"));
                        accident.setStateName(rs.getString("state_name"));
                        accident.setCountyName(rs.getString("county_name"));
                        accident.setTotalVehicles(rs.getInt("total_vehicles"));
                        accident.setFatals(rs.getInt("fatals"));
                        accident.setPersons(rs.getInt("persons"));
                        accident.setPeds(rs.getInt("peds"));

                        accidents.add(accident);
                    }
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        int totalPaginations = (int) Math.ceil((double) totalCount / size);
        return new PaginatedResults<>(accidents, totalPaginations);
    }

    public PaginatedResults<Accident> findByCrashDateBetween(String startDate, String endDate, int page, int size) {
        List<Accident> accidents = new ArrayList<>();
        String query = "SELECT * FROM accidents WHERE crash_date BETWEEN ? AND ? LIMIT ? OFFSET ?";
        String countQuery = "SELECT COUNT(*) FROM accidents WHERE crash_date BETWEEN ? AND ?";
        int totalCount = 0;

        try (Connection conn = dataSource.getConnection()) {
            try (PreparedStatement countStmt = conn.prepareStatement(countQuery)) {
                countStmt.setString(1, startDate);
                countStmt.setString(2, endDate);
                try (ResultSet rs = countStmt.executeQuery()) {
                    if (rs.next()) {
                        totalCount = rs.getInt(1);
                    }
                }
            }

            try (PreparedStatement pstmt = conn.prepareStatement(query)) {
                pstmt.setString(1, startDate);
                pstmt.setString(2, endDate);
                pstmt.setInt(3, size);
                pstmt.setInt(4, page * size);
                try (ResultSet rs = pstmt.executeQuery()) {
                    while (rs.next()) {
                        Accident accident = new Accident();
                        AccidentId accidentId = new AccidentId(
                                rs.getLong("case_id"),
                                rs.getString("year")
                        );
                        accident.setId(accidentId);
                        accident.setState(rs.getInt("state"));
                        accident.setCrashDate(rs.getString("crash_date"));
                        accident.setStateName(rs.getString("state_name"));
                        accident.setCountyName(rs.getString("county_name"));
                        accident.setTotalVehicles(rs.getInt("total_vehicles"));
                        accident.setFatals(rs.getInt("fatals"));
                        accident.setPersons(rs.getInt("persons"));
                        accident.setPeds(rs.getInt("peds"));

                        accidents.add(accident);
                    }
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        int totalPaginations = (int) Math.ceil((double) totalCount / size);
        return new PaginatedResults<>(accidents, totalPaginations);
    }

    public List<Map<String, Object>> findAccidentsByYearRange(int startYear, int endYear) {
        List<Map<String, Object>> accidents = new ArrayList<>();
        String query = "SELECT state_name, COUNT(*) as count FROM accidents WHERE year BETWEEN ? AND ? GROUP BY state_name";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {

            pstmt.setInt(1, startYear);
            pstmt.setInt(2, endYear);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", rs.getString("state_name"));
                    map.put("label", rs.getString("state_name"));
                    map.put("value", rs.getInt("count"));
                    accidents.add(map);
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return accidents;
    }

    public List<Map<String, Object>> findAccidentsByState(int stateId) {
        List<Map<String, Object>> accidents = new ArrayList<>();
        String query = "SELECT year, COUNT(*) AS total FROM accidents WHERE state = ? GROUP BY year";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {

            pstmt.setInt(1, stateId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("year", rs.getString("year"));
                    map.put("total", rs.getInt("total"));
                    accidents.add(map);
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return accidents;
    }
}
