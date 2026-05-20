import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Categoria, CreateCategoriaDto } from '../models/categoria.model';

@Injectable({
    providedIn: 'root'
})
export class CategoriasService {

    private http = inject(HttpClient);
    private readonly API = `${environment.apiUrl}/categorias`;

    getAll(): Observable<Categoria[]> {
        return this.http.get<Categoria[]>(this.API);
    }

    getOne(id: number): Observable<Categoria> {
        return this.http.get<Categoria>(`${this.API}/${id}`);
    }

    create(dto: CreateCategoriaDto): Observable<Categoria> {
        return this.http.post<Categoria>(this.API, dto);
    }

    update(id: number, dto: Partial<CreateCategoriaDto>): Observable<Categoria> {
        return this.http.put<Categoria>(`${this.API}/${id}`, dto);
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.API}/${id}`);
    }
}