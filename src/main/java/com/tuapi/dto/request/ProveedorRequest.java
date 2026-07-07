package com.tuapi.dto.request;

import jakarta.validation.constraints.NotBlank;

public class ProveedorRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    private String contacto;
    private String telefono;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getContacto() { return contacto; }
    public void setContacto(String contacto) { this.contacto = contacto; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
}
