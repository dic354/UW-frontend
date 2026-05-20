import { Producto } from './producto.model';

// Un item dentro del carrito
export interface CarritoItem {
  id: number;
  usuarioId: number;
  productoId: number;
  cantidad: number;
  fechaAgregado: string;
  producto: Pick<Producto, 'id' | 'nombre' | 'precio' | 'imagenUrl' | 'stock' | 'activo'>;
}

// Respuesta completa de GET /carrito
export interface CarritoResponse {
  items: CarritoItem[];
  total: string;       // viene como string con 2 decimales ej: "59.90"
  totalItems: number;
}

// Lo que enviamos a POST /carrito
export interface AddCarritoDto {
  productoId: number;
  cantidad: number;
}

// Lo que enviamos a PUT /carrito/:id
export interface UpdateCarritoDto {
  cantidad: number;
}