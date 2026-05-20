// Estados posibles de un pedido
export type EstadoPedido = 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';

// Métodos de pago disponibles
export type MetodoPago = 'tarjeta' | 'paypal' | 'transferencia';

// Línea de detalle dentro de un pedido
export interface DetallePedido {
  id: number;
  pedidoId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  producto?: {
    id: number;
    nombre: string;
    imagenUrl?: string;
  };
}

// Pedido completo
export interface Pedido {
  id: number;
  usuarioId: number;
  fechaPedido: string;
  estado: EstadoPedido;
  total: number;
  direccionEnvio: string;
  ciudadEnvio: string;
  codigoPostalEnvio: string;
  metodoPago: MetodoPago;
  fechaEnvio?: string;
  descuento?: {
    codigo: string;
    porcentaje: number;
  };
  detalles: DetallePedido[];
  usuario?: {
    id: number;
    nombre: string;
    email: string;
  };
}

// Lo que enviamos a POST /pedidos
export interface CreatePedidoDto {
  direccionEnvio: string;
  ciudadEnvio: string;
  codigoPostalEnvio: string;
  metodoPago: MetodoPago;
  codigoDescuento?: string;
}

// Lo que enviamos a PUT /pedidos/:id/estado (solo admin)
export interface UpdateEstadoDto {
  estado: EstadoPedido;
}