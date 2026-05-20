import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ResenasResponse,
  CreateResenaDto,
  UpdateResenaDto
} from '../models/resena.model';

@Injectable({
  providedIn: 'root'
})
export class ResenasService {

  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/resenas`;

  getByProducto(productoId: number): Observable<ResenasResponse> {
    return this.http.get<ResenasResponse>(`${this.API}/producto/${productoId}`);
  }

  create(dto: CreateResenaDto): Observable<any> {
    return this.http.post(this.API, dto);
  }

  update(id: number, dto: UpdateResenaDto): Observable<any> {
    return this.http.put(`${this.API}/${id}`, dto);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}