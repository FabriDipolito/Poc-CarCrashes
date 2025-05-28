package com.example.demo.DTO;

public class PieChartDataVehicles {
    private int id;
    private String label;
    private int value;
    private String color;

    public PieChartDataVehicles(int id, String label, int value, String color) {
        this.id = id;
        this.label = label;
        this.value = value;
        this.color = color;
    }

    // Getters y Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}