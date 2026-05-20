import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CarritoResponse,
  AddCarritoDto,
  UpdateCarritoDto
} from '../models/carrito.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/carrito`;

  // BehaviorSubject para que el navbar muestre
  // el número de items del carrito en tiempo real
  private totalItems = new BehaviorSubject<number>(0);
  totalItems$ = this.totalItems.asObservable();

  getCarrito(): Observable<CarritoResponse> {
    return this.http.get<CarritoResponse>(this.API).pipe(
      tap(res => this.totalItems.next(res.totalItems))
    );
  }

  addItem(dto: AddCarritoDto): Observable<any> {
    return this.http.post(this.API, dto).pipe(
      tap(() => this.totalItems.next(this.totalItems.value + 1))
    );
  }

  updateItem(id: number, dto: UpdateCarritoDto): Observable<any> {
    return this.http.put(`${this.API}/${id}`, dto);
  }

  removeItem(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`).pipe(
      tap(() => this.totalItems.next(Math.max(0, this.totalItems.value - 1)))
    );
  }

  clearCarrito(): Observable<any> {
    return this.http.delete(this.API).pipe(
      tap(() => this.totalItems.next(0))
    );
  }
}