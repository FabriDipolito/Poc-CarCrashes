package com.example.demo.DTO.treeMap;

import java.util.List;

public class ModelNode {
    private String name;
    private List<YearNode> children;

    public ModelNode(String name, List<YearNode> children) {
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
    public List<YearNode> getChildren() {
        return children;
    }
    public void setChildren(List<YearNode> children) {
        this.children = children;
    }
}
