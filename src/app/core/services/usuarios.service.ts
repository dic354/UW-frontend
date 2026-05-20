import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Usuario,
  UpdateUsuarioDto,
  ChangePasswordDto
} from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/usuarios`;

  getMe(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API}/me`);
  }

  updateMe(dto: UpdateUsuarioDto): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API}/me`, dto);
  }

  changePassword(dto: ChangePasswordDto): Observable<any> {
    return this.http.put(`${this.API}/me/password`, dto);
  }

  // Solo admin
  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API);
  }

  getOne(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API}/${id}`);
  }
}