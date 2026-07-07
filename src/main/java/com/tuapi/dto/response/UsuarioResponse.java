package com.tuapi.dto.response;

public class UsuarioResponse {
    private int id;
    private String nombre;
    private String email;
    private String rol;

    public UsuarioResponse(int id, String nombre, String email, String rol) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
    }

    public int getId() { return id; }
    public String getNombre() { return nombre; }
    public String getEmail() { return email; }
    public String getRol() { return rol; }
}
