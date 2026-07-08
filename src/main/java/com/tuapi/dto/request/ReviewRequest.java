package com.tuapi.dto.request;
import jakarta.validation.constraints.*;
public class ReviewRequest {
    @NotNull @Min(1) @Max(5)
    private int calificacion;
    @Size(max = 1000)
    private String comentario;
    public int getCalificacion() { return calificacion; }
    public void setCalificacion(int calificacion) { this.calificacion = calificacion; }
    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }
}
