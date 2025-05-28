package com.example.demo.DTO.treeMap;

import java.util.List;

public class TreeMapData {
    private String name;
    private List<ModelNode> children;

    public TreeMapData(String name, List<ModelNode> children) {
        this.name = name;
        this.children = children;
    }

    // Getters y Setters
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public List<ModelNode> getChildren() {
        return children;
    }
    public void setChildren(List<ModelNode> children) {
        this.children = children;
    }
}