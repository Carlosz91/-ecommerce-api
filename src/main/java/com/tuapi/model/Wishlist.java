package com.tuapi.model;

import jakarta.persistence.*;

@Entity
@Table(name = "wishlists")
public class Wishlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private int usuarioId;

    @Column(nullable = false)
    private int productoId;

    public Wishlist() {}

    public Wishlist(int id, int usuarioId, int productoId) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.productoId = productoId;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getUsuarioId() { return usuarioId; }
    public void setUsuarioId(int usuarioId) { this.usuarioId = usuarioId; }
    public int getProductoId() { return productoId; }
    public void setProductoId(int productoId) { this.productoId = productoId; }

    @Override
    public String toString() {
        return String.format("Wishlist{id=%d, usuarioId=%d, productoId=%d}", id, usuarioId, productoId);
    }
}
