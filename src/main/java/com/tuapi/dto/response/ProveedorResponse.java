package com.tuapi.dto.response;

public class ProveedorResponse {
    private int id;
    private String nombre;
    private String contacto;
    private String telefono;

    public ProveedorResponse(int id, String nombre, String contacto, String telefono) {
        this.id = id;
        this.nombre = nombre;
        this.contacto = contacto;
        this.telefono = telefono;
    }

    public int getId() { return id; }
    public String getNombre() { return nombre; }
    public String getContacto() { return contacto; }
    public String getTelefono() { return telefono; }
}
