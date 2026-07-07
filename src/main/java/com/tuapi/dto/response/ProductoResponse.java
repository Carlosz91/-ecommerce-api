package com.tuapi.dto.response;

public class ProductoResponse {
    private int id;
    private String nombre;
    private double precio;
    private int stock;
    private String categoriaNombre;

    public ProductoResponse(int id, String nombre, double precio, int stock, String categoriaNombre) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
        this.categoriaNombre = categoriaNombre;
    }

    public int getId() { return id; }
    public String getNombre() { return nombre; }
    public double getPrecio() { return precio; }
    public int getStock() { return stock; }
    public String getCategoriaNombre() { return categoriaNombre; }
}
