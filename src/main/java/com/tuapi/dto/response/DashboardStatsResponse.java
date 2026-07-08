package com.tuapi.dto.response;
public class DashboardStatsResponse {
    private long totalProductos;
    private long totalCategorias;
    private long totalPedidos;
    private long totalUsuarios;
    private double ventasDia;
    private double ventasMes;
    private long pedidosPendientes;
    private long productosSinStock;
    public DashboardStatsResponse() {}
    public long getTotalProductos() { return totalProductos; }
    public void setTotalProductos(long totalProductos) { this.totalProductos = totalProductos; }
    public long getTotalCategorias() { return totalCategorias; }
    public void setTotalCategorias(long totalCategorias) { this.totalCategorias = totalCategorias; }
    public long getTotalPedidos() { return totalPedidos; }
    public void setTotalPedidos(long totalPedidos) { this.totalPedidos = totalPedidos; }
    public long getTotalUsuarios() { return totalUsuarios; }
    public void setTotalUsuarios(long totalUsuarios) { this.totalUsuarios = totalUsuarios; }
    public double getVentasDia() { return ventasDia; }
    public void setVentasDia(double ventasDia) { this.ventasDia = ventasDia; }
    public double getVentasMes() { return ventasMes; }
    public void setVentasMes(double ventasMes) { this.ventasMes = ventasMes; }
    public long getPedidosPendientes() { return pedidosPendientes; }
    public void setPedidosPendientes(long pedidosPendientes) { this.pedidosPendientes = pedidosPendientes; }
    public long getProductosSinStock() { return productosSinStock; }
    public void setProductosSinStock(long productosSinStock) { this.productosSinStock = productosSinStock; }
}
