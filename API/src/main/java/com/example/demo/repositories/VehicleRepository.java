package com.example.demo.repositories;

import com.example.demo.DTO.PaginatedResults;
import com.example.demo.DTO.PieChartDataVehicles;
import com.example.demo.DTO.treeMap.ModelNode;
import com.example.demo.DTO.treeMap.TreeMapData;
import com.example.demo.DTO.treeMap.YearNode;
import com.example.demo.entities.Vehicle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.*;

@Repository
public class VehicleRepository {

    @Autowired
    private DataSource dataSource;

    public VehicleRepository() {};
    private final String[] COLORS = {"#0088FE", "#00C49F", "#FFBB28", "#FF8042"};

    public List<Vehicle> findAll() {
        List<Vehicle> vehicles = new ArrayList<>();
        String query = "SELECT * FROM vehicle";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query);
             ResultSet rs = pstmt.executeQuery()) {

            while (rs.next()) {
                Vehicle vehicle = new Vehicle();
                vehicle.setVehicleId(rs.getLong("vehicle_id"));
                vehicle.setMakeId(rs.getInt("make_id"));
                vehicle.setMakeName(rs.getString("make_name"));
                vehicle.setModel(rs.getInt("model"));
                vehicle.setModelName(rs.getString("model_name"));
                vehicle.setModelYear(rs.getString("model_year"));
                vehicle.setBodyType(rs.getInt("body_type"));
                vehicle.setBodyTypeName(rs.getString("body_type_name"));
                vehicle.setAccidentId(rs.getLong("accident_id"));
                vehicles.add(vehicle);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return vehicles;
    }

    public List<Map<String, Object>> findAllUniqueMakes() {
        List<Map<String, Object>> makes = new ArrayList<>();
        String query = "SELECT DISTINCT make_id AS id, make_name AS name FROM vehicle";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query);
             ResultSet rs = pstmt.executeQuery()) {

            while (rs.next()) {
                Map<String, Object> make = new HashMap<>();
                make.put("id", rs.getInt("id"));
                make.put("name", rs.getString("name"));
                makes.add(make);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return makes;
    }

    public List<Map<String, Object>> findModelsByMakeId(int makeId) {
        List<Map<String, Object>> models = new ArrayList<>();
        String query = "SELECT model, MIN(model_name) as model_name FROM vehicle WHERE make_id = ? GROUP BY model ORDER BY model_name ASC";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {

            pstmt.setInt(1, makeId);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> model = new HashMap<>();
                    model.put("id", rs.getInt("model"));
                    model.put("name", rs.getString("model_name"));
                    models.add(model);
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return models;
    }

    public PaginatedResults<Vehicle> findByMakeIdAndModel(int makeId, int modelId, int page, int size) {
        List<Vehicle> vehicles = new ArrayList<>();
        String query = "SELECT * FROM vehicle WHERE make_id = ? AND model = ? LIMIT ? OFFSET ?";
        String countQuery = "SELECT COUNT(*) FROM vehicle WHERE make_id = ? AND model = ?";

        int totalCount = 0;

        try (Connection conn = dataSource.getConnection()) {

            try (PreparedStatement countStmt = conn.prepareStatement(countQuery)) {
                countStmt.setInt(1, makeId);
                countStmt.setInt(2, modelId);

                try (ResultSet rs = countStmt.executeQuery()) {
                    if (rs.next()) {
                        totalCount = rs.getInt(1);
                    }
                }
            }

            try (PreparedStatement pstmt = conn.prepareStatement(query)) {
                pstmt.setInt(1, makeId);
                pstmt.setInt(2, modelId);
                pstmt.setInt(3, size);
                pstmt.setInt(4, page * size);

                try (ResultSet rs = pstmt.executeQuery()) {
                    while (rs.next()) {
                        Vehicle vehicle = new Vehicle();
                        vehicle.setVehicleId(rs.getLong("vehicle_id"));
                        vehicle.setMakeId(rs.getInt("make_id"));
                        vehicle.setMakeName(rs.getString("make_name"));
                        vehicle.setModel(rs.getInt("model"));
                        vehicle.setModelName(rs.getString("model_name"));
                        vehicle.setModelYear(rs.getString("model_year"));
                        vehicle.setBodyType(rs.getInt("body_type"));
                        vehicle.setBodyTypeName(rs.getString("body_type_name"));
                        vehicle.setAccidentId(rs.getLong("accident_id"));

                        vehicles.add(vehicle);
                    }
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        int totalPaginations = (int) Math.ceil((double) totalCount / size);
        return new PaginatedResults<>(vehicles, totalPaginations);
    }

    public PaginatedResults<Vehicle> findByMakeId(int makeId, int page, int size) {
        List<Vehicle> vehicles = new ArrayList<>();
        String query = "SELECT * FROM vehicle WHERE make_id = ? LIMIT ? OFFSET ?";
        String countQuery = "SELECT COUNT(*) FROM vehicle WHERE make_id = ?";

        int totalCount = 0;

        try (Connection conn = dataSource.getConnection()) {

            try (PreparedStatement countStmt = conn.prepareStatement(countQuery)) {
                countStmt.setInt(1, makeId);

                try (ResultSet rs = countStmt.executeQuery()) {
                    if (rs.next()) {
                        totalCount = rs.getInt(1);
                    }
                }
            }

            try (PreparedStatement pstmt = conn.prepareStatement(query)) {
                pstmt.setInt(1, makeId);
                pstmt.setInt(2, size);
                pstmt.setInt(3, page * size);

                try (ResultSet rs = pstmt.executeQuery()) {
                    while (rs.next()) {
                        Vehicle vehicle = new Vehicle();
                        vehicle.setVehicleId(rs.getLong("vehicle_id"));
                        vehicle.setMakeId(rs.getInt("make_id"));
                        vehicle.setMakeName(rs.getString("make_name"));
                        vehicle.setModel(rs.getInt("model"));
                        vehicle.setModelName(rs.getString("model_name"));
                        vehicle.setModelYear(rs.getString("model_year"));
                        vehicle.setBodyType(rs.getInt("body_type"));
                        vehicle.setBodyTypeName(rs.getString("body_type_name"));
                        vehicle.setAccidentId(rs.getLong("accident_id"));

                        vehicles.add(vehicle);
                    }
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        int totalPaginations = (int) Math.ceil((double) totalCount / size);
        return new PaginatedResults<>(vehicles, totalPaginations);
    }

    public PaginatedResults<Vehicle> findByModel(int modelId, int page, int size) {
        List<Vehicle> vehicles = new ArrayList<>();
        String query = "SELECT * FROM vehicle WHERE model = ? LIMIT ? OFFSET ?";
        String countQuery = "SELECT COUNT(*) FROM vehicle WHERE model = ?";

        int totalCount = 0;

        try (Connection conn = dataSource.getConnection()) {

            try (PreparedStatement countStmt = conn.prepareStatement(countQuery)) {
                countStmt.setInt(1, modelId);

                try (ResultSet rs = countStmt.executeQuery()) {
                    if (rs.next()) {
                        totalCount = rs.getInt(1);
                    }
                }
            }

            try (PreparedStatement pstmt = conn.prepareStatement(query)) {
                pstmt.setInt(1, modelId);
                pstmt.setInt(2, size);
                pstmt.setInt(3, page * size);

                try (ResultSet rs = pstmt.executeQuery()) {
                    while (rs.next()) {
                        Vehicle vehicle = new Vehicle();
                        vehicle.setVehicleId(rs.getLong("vehicle_id"));
                        vehicle.setMakeId(rs.getInt("make_id"));
                        vehicle.setMakeName(rs.getString("make_name"));
                        vehicle.setModel(rs.getInt("model"));
                        vehicle.setModelName(rs.getString("model_name"));
                        vehicle.setModelYear(rs.getString("model_year"));
                        vehicle.setBodyType(rs.getInt("body_type"));
                        vehicle.setBodyTypeName(rs.getString("body_type_name"));
                        vehicle.setAccidentId(rs.getLong("accident_id"));

                        vehicles.add(vehicle);
                    }
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        int totalPaginations = (int) Math.ceil((double) totalCount / size);
        return new PaginatedResults<>(vehicles, totalPaginations);
    }

    public PaginatedResults<Vehicle> findAll(int page, int size) {
        List<Vehicle> vehicles = new ArrayList<>();
        String query = "SELECT * FROM vehicle LIMIT ? OFFSET ?";
        String countQuery = "SELECT COUNT(*) FROM vehicle";

        int totalCount = 0;

        try (Connection conn = dataSource.getConnection()) {

            try (PreparedStatement countStmt = conn.prepareStatement(countQuery)) {
                try (ResultSet rs = countStmt.executeQuery()) {
                    if (rs.next()) {
                        totalCount = rs.getInt(1);
                    }
                }
            }

            try (PreparedStatement pstmt = conn.prepareStatement(query)) {
                pstmt.setInt(1, size);
                pstmt.setInt(2, page * size);

                try (ResultSet rs = pstmt.executeQuery()) {
                    while (rs.next()) {
                        Vehicle vehicle = new Vehicle();
                        vehicle.setVehicleId(rs.getLong("vehicle_id"));
                        vehicle.setMakeId(rs.getInt("make_id"));
                        vehicle.setMakeName(rs.getString("make_name"));
                        vehicle.setModel(rs.getInt("model"));
                        vehicle.setModelName(rs.getString("model_name"));
                        vehicle.setModelYear(rs.getString("model_year"));
                        vehicle.setBodyType(rs.getInt("body_type"));
                        vehicle.setBodyTypeName(rs.getString("body_type_name"));
                        vehicle.setAccidentId(rs.getLong("accident_id"));

                        vehicles.add(vehicle);
                    }
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        int totalPaginations = (int) Math.ceil((double) totalCount / size);
        return new PaginatedResults<>(vehicles, totalPaginations);
    }

    public List<PieChartDataVehicles> getPieChartData(int startYear, int endYear, String filterType) {
        List<PieChartDataVehicles> pieChartDataList = new ArrayList<>();
        String query = "SELECT make_id, make_name, COUNT(*) as accident_count " +
                "FROM vehicle WHERE year BETWEEN ? AND ? " +
                "GROUP BY make_id, make_name " +
                "ORDER BY accident_count " + (filterType.equals("dangerous") ? "DESC" : "ASC") +
                " LIMIT 10";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {

            pstmt.setInt(1, startYear);
            pstmt.setInt(2, endYear);

            try (ResultSet rs = pstmt.executeQuery()) {
                int index = 0;
                while (rs.next()) {
                    int id = rs.getInt("make_id");
                    String label = rs.getString("make_name");
                    int value = rs.getInt("accident_count");
                    String color = COLORS[index % COLORS.length];

                    pieChartDataList.add(new PieChartDataVehicles(id, label, value, color));
                    index++;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return pieChartDataList;
    }

    public TreeMapData getTreeMapData(int makeId, String filterType) {
        Map<String, Map<String, Integer>> modelMap = new HashMap<>();
        String manufacturerName = "";

        String query = "SELECT * FROM vehicle WHERE make_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {

            pstmt.setInt(1, makeId);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    int currentMakeId = rs.getInt("make_id");
                    if (manufacturerName.isEmpty()) {
                        manufacturerName = rs.getString("make_name");
                    }
                    String modelName = rs.getString("model_name");
                    String modelYear = rs.getString("model_year");

                    modelMap.computeIfAbsent(modelName, k -> new HashMap<>());
                    Map<String, Integer> yearMap = modelMap.get(modelName);
                    yearMap.put(modelYear, yearMap.getOrDefault(modelYear, 0) + 1);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        List<ModelNode> modelNodes = new ArrayList<>();

        for (Map.Entry<String, Map<String, Integer>> entry : modelMap.entrySet()) {
            String modelName = entry.getKey();
            Map<String, Integer> yearMap = entry.getValue();

            int totalAccidentsForModel = yearMap.values().stream().mapToInt(Integer::intValue).sum();

            if (filterType.equals("dangerous") && totalAccidentsForModel < 100) {
                continue;
            }

            List<YearNode> yearNodes = new ArrayList<>();
            for (Map.Entry<String, Integer> yearEntry : yearMap.entrySet()) {
                yearNodes.add(new YearNode(yearEntry.getKey(), yearEntry.getValue()));
            }

            yearNodes.sort(Comparator.comparing(YearNode::getName));

            modelNodes.add(new ModelNode(modelName, yearNodes));
        }

        modelNodes.sort(Comparator.comparing(ModelNode::getName));

        return new TreeMapData(manufacturerName, modelNodes);
    }

}
