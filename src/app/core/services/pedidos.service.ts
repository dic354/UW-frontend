import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pedido, CreatePedidoDto, UpdateEstadoDto } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/pedidos`;

  create(dto: CreatePedidoDto): Observable<Pedido> {
    return this.http.post<Pedido>(this.API, dto);
  }

  getMisPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.API}/mis-pedidos`);
  }

  getOne(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.API}/${id}`);
  }

  // Solo admin
  getAll(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.API);
  }

  // Solo admin
  updateEstado(id: number, dto: UpdateEstadoDto): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.API}/${id}/estado`, dto);
  }
}