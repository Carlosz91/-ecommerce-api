package com.tuapi.dto.response;

public class CategoriaResponse {
    private int id;
    private String nombre;

    public CategoriaResponse(int id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }

    public int getId() { return id; }
    public String getNombre() { return nombre; }
}
