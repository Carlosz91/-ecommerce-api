export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoriaId?: number;
  categoriaNombre?: string;
  imagenUrl?: string;
  destacado?: boolean;
  descuento?: number;
  precioOriginal?: number;
  marca?: string;
  calificacionPromedio?: number;
  totalReviews?: number;
  _inWishlist?: boolean;
}
