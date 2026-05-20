// Tallas posibles, igual que el enum de Prisma
export type Talla = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

// Imagen adicional de un producto
export interface ProductoImagen {
  id: number;
  productoId: number;
  url: string;
  orden: number;
}

// Reseña dentro de un producto
export interface Resena {
  id: number;
  puntuacion: number;
  comentario?: string;
  fechaResena: string;
  usuario: {
    id: number;
    nombre: string;
  };
}

// Producto completo (GET /productos/:id)
export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoriaId: number;
  stock: number;
  talla?: Talla;
  color?: string;
  imagenUrl?: string;
  activo: boolean;
  fechaCreacion: string;
  categoria?: {
    id: number;
    nombre: string;
  };
  imagenes?: ProductoImagen[];
  resenas?: Resena[];
}

// Respuesta paginada de GET /productos
export interface ProductosResponse {
  datos: Producto[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

// Filtros que acepta GET /productos
export interface FiltroProducto {
  nombre?: string;
  categoriaId?: number;
  precioMin?: number;
  precioMax?: number;
  talla?: Talla;
  color?: string;
  pagina?: number;
  limite?: number;
}

// Lo que enviamos a POST /productos (solo admin)
export interface CreateProductoDto {
  nombre: string;
  descripcion?: string;
  precio: number;
  categoriaId: number;
  stock: number;
  talla?: Talla;
  color?: string;
  imagenUrl?: string;
}

// Lo que enviamos a POST /producto-imagen (solo admin)
export interface CreateImagenDto {
  productoId: number;
  url: string;
  orden?: number;
}

// Lo que enviamos a PUT /producto-imagen/:id (solo admin)
export interface UpdateImagenDto {
  url?: string;
  orden?: number;
}