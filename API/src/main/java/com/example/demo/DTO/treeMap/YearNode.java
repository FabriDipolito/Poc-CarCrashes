package com.example.demo.DTO.treeMap;

public class YearNode {
    private String name;
    private int loc;

    public YearNode(String name, int loc) {
        this.name = name;
        this.loc = loc;
    }

    // Getters y Setters
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public int getLoc() {
        return loc;
    }
    public void setLoc(int loc) {
        this.loc = loc;
    }
}

