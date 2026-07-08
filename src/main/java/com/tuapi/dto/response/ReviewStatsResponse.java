package com.tuapi.dto.response;
public class ReviewStatsResponse {
    private double promedio;
    private int total;
    public ReviewStatsResponse() {}
    public ReviewStatsResponse(double promedio, int total) { this.promedio = promedio; this.total = total; }
    public double getPromedio() { return promedio; }
    public void setPromedio(double promedio) { this.promedio = promedio; }
    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }
}
