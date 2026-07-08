package com.tuapi.model;

import jakarta.persistence.*;

@Entity
@Table(name = "productos")
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private double precio;

    @Column
    private String descripcion;

    @Column(nullable = false)
    private int stock;

    @Column(nullable = false)
    private int categoriaId;

    @Column
    private String imagenUrl;

    @Column(nullable = false)
    private boolean destacado = false;

    @Column(nullable = false)
    private double descuento = 0;

    @Column
    private Double precioOriginal;

    @Column
    private String marca;

    public Producto() {}

    public Producto(int id, String nombre, String descripcion, double precio, int stock, int categoriaId) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.categoriaId = categoriaId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }

    public int getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(int categoriaId) {
        this.categoriaId = categoriaId;
    }

    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }
    public boolean isDestacado() { return destacado; }
    public void setDestacado(boolean destacado) { this.destacado = destacado; }
    public double getDescuento() { return descuento; }
    public void setDescuento(double descuento) { this.descuento = descuento; }
    public Double getPrecioOriginal() { return precioOriginal; }
    public void setPrecioOriginal(Double precioOriginal) { this.precioOriginal = precioOriginal; }
    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }

    @Override
    public String toString() {
        return String.format("ID: %d | %s - $%.2f (Stock: %d, Cat: %d)", id, nombre, precio, stock, categoriaId);
    }
}
