export interface DetallePedido {
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  fecha: string;
  total: number;
  detalles: DetallePedido[];
}
