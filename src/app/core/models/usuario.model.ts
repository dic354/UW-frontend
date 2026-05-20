// Roles posibles, igual que el enum del schema de Prisma
export type Rol = 'cliente' | 'administrador';

// Lo que devuelve el backend al hacer GET /usuarios/me
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  codigoPostal?: string;
  rol: Rol;
  fechaRegistro: string;
}

// Lo que devuelve /auth/login
export interface AuthResponse {
  access_token: string;
  usuario: {
    id: number;
    nombre: string;
    email: string;
    rol: Rol;
  };
}

// Lo que enviamos a POST /auth/register
export interface RegisterDto {
  nombre: string;
  email: string;
  contrasena: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  codigoPostal?: string;
}

// Lo que enviamos a POST /auth/login
export interface LoginDto {
  email: string;
  contrasena: string;
}

// Lo que enviamos a PUT /usuarios/me
export interface UpdateUsuarioDto {
  nombre?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  codigoPostal?: string;
}

// Lo que enviamos a PUT /usuarios/me/password
export interface ChangePasswordDto {
  contrasenaActual: string;
  contrasenaNueva: string;
}