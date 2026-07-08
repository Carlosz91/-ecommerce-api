package com.tuapi.dto.response;
public class WishlistResponse {
    private int id;
    private int productoId;
    private String productoNombre;
    private double productoPrecio;
    private String productoCategoria;
    private String productoImagen;
    public WishlistResponse() {}
    public WishlistResponse(int id, int productoId, String productoNombre, double productoPrecio, String productoCategoria, String productoImagen) {
        this.id = id; this.productoId = productoId; this.productoNombre = productoNombre; this.productoPrecio = productoPrecio; this.productoCategoria = productoCategoria; this.productoImagen = productoImagen;
    }
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getProductoId() { return productoId; }
    public void setProductoId(int productoId) { this.productoId = productoId; }
    public String getProductoNombre() { return productoNombre; }
    public void setProductoNombre(String productoNombre) { this.productoNombre = productoNombre; }
    public double getProductoPrecio() { return productoPrecio; }
    public void setProductoPrecio(double productoPrecio) { this.productoPrecio = productoPrecio; }
    public String getProductoCategoria() { return productoCategoria; }
    public void setProductoCategoria(String productoCategoria) { this.productoCategoria = productoCategoria; }
    public String getProductoImagen() { return productoImagen; }
    public void setProductoImagen(String productoImagen) { this.productoImagen = productoImagen; }
}
