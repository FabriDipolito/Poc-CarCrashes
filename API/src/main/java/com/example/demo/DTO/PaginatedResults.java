package com.example.demo.DTO;

import java.util.List;

public class PaginatedResults<T> {
    private List<T> array;
    private int totalPaginations;

    public PaginatedResults(List<T> array, int totalPaginations) {
        this.array = array;
        this.totalPaginations = totalPaginations;
    }

    public List<T> getArray() {
        return array;
    }

    public int getTotalPaginations() {
        return totalPaginations;
    }
}
