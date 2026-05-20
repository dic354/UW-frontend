// Lo que devuelve GET /categorias
export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  imagenCategoria?: string;
  _count?: {
    productos: number; // cuántos productos tiene la categoría
  };
}

// Lo que enviamos a POST /categorias (solo admin)
export interface CreateCategoriaDto {
  nombre: string;
  descripcion?: string;
  imagenCategoria?: string;
}