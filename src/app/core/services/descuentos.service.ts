import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Descuento,
  CreateDescuentoDto,
  ValidarDescuentoDto,
  ValidacionDescuento
} from '../models/descuento.model';

@Injectable({
  providedIn: 'root'
})
export class DescuentosService {

  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/descuentos`;

  // Público — cualquier usuario logado puede validar un código
  validar(dto: ValidarDescuentoDto): Observable<ValidacionDescuento> {
    return this.http.post<ValidacionDescuento>(`${this.API}/validar`, dto);
  }

  // Solo admin
  getAll(): Observable<Descuento[]> {
    return this.http.get<Descuento[]>(this.API);
  }

  getOne(id: number): Observable<Descuento> {
    return this.http.get<Descuento>(`${this.API}/${id}`);
  }

  create(dto: CreateDescuentoDto): Observable<Descuento> {
    return this.http.post<Descuento>(this.API, dto);
  }

  update(id: number, dto: Partial<CreateDescuentoDto>): Observable<Descuento> {
    return this.http.put<Descuento>(`${this.API}/${id}`, dto);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}