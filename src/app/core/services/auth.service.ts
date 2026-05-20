import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  LoginDto,
  RegisterDto,
  Usuario
} from '../models/usuario.model';

@Injectable({
  providedIn: 'root' // disponible en toda la app sin registrarlo manualmente
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'urbanwear_token';
  private readonly USER_KEY = 'urbanwear_user';

  // BehaviorSubject guarda el estado actual del usuario
  // cualquier componente puede suscribirse para saber
  // si hay sesión activa o no en tiempo real
  private usuarioActual = new BehaviorSubject<AuthResponse['usuario'] | null>(
    this.getUserFromStorage()
  );

  // Observable público (solo lectura) que los componentes consumen
  usuario$ = this.usuarioActual.asObservable();

  // ─── REGISTRO ────────────────────────────────────────
  register(dto: RegisterDto): Observable<any> {
    return this.http.post(`${this.API}/register`, dto);
  }

  // ─── LOGIN ───────────────────────────────────────────
  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/login`, dto).pipe(
      tap(res => {
        // tap = ejecuta código sin modificar el valor del observable
        // guardamos token y usuario en localStorage
        localStorage.setItem(this.TOKEN_KEY, res.access_token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(res.usuario));
        // notificamos a todos los suscriptores que hay un usuario activo
        this.usuarioActual.next(res.usuario);
      })
    );
  }

  // ─── LOGOUT ──────────────────────────────────────────
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.usuarioActual.next(null);
    this.router.navigate(['/auth/login']);
  }

  // ─── HELPERS ─────────────────────────────────────────
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.usuarioActual.value?.rol === 'administrador';
  }

  // Lee el usuario guardado en localStorage al iniciar la app
  // para restaurar la sesión si el usuario ya había hecho login antes
  private getUserFromStorage(): AuthResponse['usuario'] | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }
}