import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ProductoImagen,
  CreateImagenDto,
  UpdateImagenDto
} from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoImagenService {

  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/producto-imagen`;

  getByProducto(productoId: number): Observable<ProductoImagen[]> {
    return this.http.get<ProductoImagen[]>(`${this.API}/producto/${productoId}`);
  }

  create(dto: CreateImagenDto): Observable<ProductoImagen> {
    return this.http.post<ProductoImagen>(this.API, dto);
  }

  update(id: number, dto: UpdateImagenDto): Observable<ProductoImagen> {
    return this.http.put<ProductoImagen>(`${this.API}/${id}`, dto);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}