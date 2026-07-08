import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Producto } from '../models/producto';
import { Categoria } from '../models/categoria';
import { Carrito } from '../models/carrito';
import { Pedido } from '../models/pedido';
import { PageResponse } from '../models/page-response';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  register(dto: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, dto);
  }

  login(dto: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login`, dto);
  }

  refresh(refreshToken: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/refresh`, { refreshToken });
  }

  logout(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/logout`, {});
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${environment.apiUrl}/categorias`);
  }

  getCategoria(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${environment.apiUrl}/categorias/${id}`);
  }

  createCategoria(dto: Partial<Categoria>): Observable<Categoria> {
    return this.http.post<Categoria>(`${environment.apiUrl}/categorias`, dto);
  }

  updateCategoria(id: number, dto: Partial<Categoria>): Observable<Categoria> {
    return this.http.put<Categoria>(`${environment.apiUrl}/categorias/${id}`, dto);
  }

  deleteCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/categorias/${id}`);
  }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${environment.apiUrl}/productos`);
  }

  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${environment.apiUrl}/productos/${id}`);
  }

  createProducto(dto: Partial<Producto>): Observable<Producto> {
    return this.http.post<Producto>(`${environment.apiUrl}/productos`, dto);
  }

  updateProducto(id: number, dto: Partial<Producto>): Observable<Producto> {
    return this.http.put<Producto>(`${environment.apiUrl}/productos/${id}`, dto);
  }

  deleteProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/productos/${id}`);
  }

  getProductosPage(page: number, size: number): Observable<PageResponse<Producto>> {
    return this.http.get<PageResponse<Producto>>(`${environment.apiUrl}/productos/page?page=${page}&size=${size}`);
  }

  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/clientes`);
  }

  getCliente(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/clientes/${id}`);
  }

  createCliente(dto: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/clientes`, dto);
  }

  updateCliente(id: number, dto: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/clientes/${id}`, dto);
  }

  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/clientes/${id}`);
  }

  getProveedores(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/proveedores`);
  }

  getProveedor(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/proveedores/${id}`);
  }

  createProveedor(dto: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/proveedores`, dto);
  }

  deleteProveedor(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/proveedores/${id}`);
  }

  crearCarrito(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/carrito`, {});
  }

  agregarItemCarrito(carritoId: number, productoId: number, cantidad: number): Observable<Carrito> {
    return this.http.post<Carrito>(`${environment.apiUrl}/carrito/${carritoId}/items`, { productoId, cantidad });
  }

  eliminarItemCarrito(carritoId: number, itemId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/carrito/${carritoId}/items/${itemId}`);
  }

  vaciarCarrito(carritoId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/carrito/${carritoId}`);
  }

  getCarrito(carritoId: number): Observable<Carrito> {
    return this.http.get<Carrito>(`${environment.apiUrl}/carrito/${carritoId}`);
  }

  confirmarCarrito(carritoId: number, clienteId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/carrito/${carritoId}/confirmar`, { clienteId });
  }

  getPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${environment.apiUrl}/pedidos`);
  }

  getPedido(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${environment.apiUrl}/pedidos/${id}`);
  }

  crearPedido(carritoId: number): Observable<Pedido> {
    return this.http.post<Pedido>(`${environment.apiUrl}/pedidos`, { carritoId });
  }

  googleLogin(idToken: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/google`, { idToken });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/reset-password`, { token, password: newPassword });
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/usuarios/perfil`, data);
  }

  changePassword(data: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/usuarios/password`, data);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/usuarios/perfil`);
  }

  getWishlist(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/wishlist`);
  }

  addToWishlist(productoId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/wishlist/${productoId}`, {});
  }

  removeFromWishlist(productoId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/wishlist/${productoId}`);
  }

  checkWishlist(productoId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/wishlist/check/${productoId}`);
  }

  getReviews(productoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/productos/${productoId}/reviews`);
  }

  getReviewStats(productoId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/productos/${productoId}/reviews/stats`);
  }

  createReview(productoId: number, data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/productos/${productoId}/reviews`, data);
  }

  getDashboardStats(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/dashboard`);
  }

  updatePedidoEstado(pedidoId: number, estado: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/admin/pedidos/${pedidoId}/estado`, { estado });
  }

  getProductosDestacados(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/productos/destacados`);
  }

  uploadImagen(productoId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${environment.apiUrl}/admin/productos/${productoId}/imagen`, formData);
  }

  searchProductos(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/productos/search?q=${encodeURIComponent(query)}`);
  }

  health(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/health`);
  }

  unlock(email: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin/unlock`, { email });
  }
}
