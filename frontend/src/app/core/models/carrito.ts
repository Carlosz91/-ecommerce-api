export interface ItemCarrito {
  id: number;
  productoId: number;
  productoNombre: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

export interface Carrito {
  id: number;
  items: ItemCarrito[];
  total: number;
}
