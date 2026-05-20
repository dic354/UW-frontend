import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Producto,
  ProductosResponse,
  FiltroProducto,
  CreateProductoDto
} from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/productos`;

  // Construye los query params dinámicamente
  // solo añade al URL los filtros que vengan informados
  getAll(filtros?: FiltroProducto): Observable<ProductosResponse> {
    let params = new HttpParams();

    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ProductosResponse>(this.API, { params });
  }

  getOne(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.API}/${id}`);
  }

  create(dto: CreateProductoDto): Observable<Producto> {
    return this.http.post<Producto>(this.API, dto);
  }

  update(id: number, dto: Partial<CreateProductoDto>): Observable<Producto> {
    return this.http.put<Producto>(`${this.API}/${id}`, dto);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}