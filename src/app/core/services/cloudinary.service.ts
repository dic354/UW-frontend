import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  private http = inject(HttpClient);

  private readonly CLOUD_NAME = environment.cloudinary.cloudName;
  private readonly UPLOAD_PRESET = environment.cloudinary.uploadPreset;
  private readonly UPLOAD_URL =
    `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/image/upload`;

  // Sube una imagen y devuelve la URL segura
  subirImagen(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.UPLOAD_PRESET);
    // Carpeta donde se guardarán las imágenes en Cloudinary
    formData.append('folder', 'urbanwear/productos');

    return this.http.post<CloudinaryResponse>(this.UPLOAD_URL, formData).pipe(
      map(res => res.secure_url)
    );
  }

  // Sube imagen de categoría en carpeta separada
  subirImagenCategoria(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.UPLOAD_PRESET);
    formData.append('folder', 'urbanwear/categorias');

    return this.http.post<CloudinaryResponse>(this.UPLOAD_URL, formData).pipe(
      map(res => res.secure_url)
    );
  }

  // Valida que el archivo sea una imagen válida
  validarImagen(file: File): { valido: boolean; error: string } {
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!tiposPermitidos.includes(file.type)) {
      return {
        valido: false,
        error: 'Solo se permiten imagenes JPG, PNG, WebP o GIF'
      };
    }

    if (file.size > maxSize) {
      return {
        valido: false,
        error: 'La imagen no puede superar 5MB'
      };
    }

    return { valido: true, error: '' };
  }
}