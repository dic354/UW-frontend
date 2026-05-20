// Respuesta de GET /resenas/producto/:id
export interface ResenasResponse {
  resenas: ResenaCompleta[];
  totalResenas: number;
  mediaPuntuacion: number;
}

export interface ResenaCompleta {
  id: number;
  puntuacion: number;
  comentario?: string;
  fechaResena: string;
  usuario: {
    id: number;
    nombre: string;
  };
}

// Lo que enviamos a POST /resenas
export interface CreateResenaDto {
  productoId: number;
  puntuacion: number;
  comentario?: string;
}

// Lo que enviamos a PUT /resenas/:id
export interface UpdateResenaDto {
  puntuacion?: number;
  comentario?: string;
}