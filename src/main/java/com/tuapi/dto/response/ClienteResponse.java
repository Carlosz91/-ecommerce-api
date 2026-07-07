package com.tuapi.dto.response;

public class ClienteResponse {
    private int id;
    private String nombre;
    private String email;
    private String telefono;

    public ClienteResponse(int id, String nombre, String email, String telefono) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
    }

    public int getId() { return id; }
    public String getNombre() { return nombre; }
    public String getEmail() { return email; }
    public String getTelefono() { return telefono; }
}
