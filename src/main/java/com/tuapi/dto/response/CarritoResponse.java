package com.tuapi.dto.response;

import java.util.List;

public class CarritoResponse {
    private int id;
    private List<ItemCarritoResponse> items;
    private double total;

    public CarritoResponse(int id, List<ItemCarritoResponse> items, double total) {
        this.id = id;
        this.items = items;
        this.total = total;
    }

    public int getId() { return id; }
    public List<ItemCarritoResponse> getItems() { return items; }
    public double getTotal() { return total; }
}
