// Descuento completo (solo admin)
export interface Descuento {
  id: number;
  codigo: string;
  porcentaje: number;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
  usosMaximos?: number;
  usosActuales: number;
  _count?: {
    pedidos: number;
  };
}

// Respuesta de POST /descuentos/validar
export interface ValidacionDescuento {
  valido: boolean;
  porcentaje: number;
  codigo: string;
}

// Lo que enviamos a POST /descuentos/validar
export interface ValidarDescuentoDto {
  codigo: string;
}

// Lo que enviamos a POST /descuentos (solo admin)
export interface CreateDescuentoDto {
  codigo: string;
  porcentaje: number;
  fechaInicio: string;
  fechaFin: string;
  activo?: boolean;
  usosMaximos?: number;
}