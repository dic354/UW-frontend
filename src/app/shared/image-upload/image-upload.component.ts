import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloudinaryService } from '../../core/services/cloudinary.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss'
})
export class ImageUploadComponent {

  private cloudinaryService = inject(CloudinaryService);

  // URL actual de la imagen (viene del formulario del padre)
  @Input() imagenActual = '';

  // Tipo de carpeta: productos o categorias
  @Input() tipo: 'producto' | 'categoria' = 'producto';

  // Emite la nueva URL cuando la subida es exitosa
  @Output() imagenSubida = new EventEmitter<string>();

  subiendo = false;
  errorMsg = '';
  preview = '';

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Validamos el archivo antes de subir
    const validacion = this.cloudinaryService.validarImagen(file);
    if (!validacion.valido) {
      this.errorMsg = validacion.error;
      return;
    }

    this.errorMsg = '';

    // Mostramos preview local inmediatamente
    const reader = new FileReader();
    reader.onload = (e) => {
      this.preview = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Subimos a Cloudinary
    this.subiendo = true;

    const obs = this.tipo === 'categoria'
      ? this.cloudinaryService.subirImagenCategoria(file)
      : this.cloudinaryService.subirImagen(file);

    obs.subscribe({
      next: (url) => {
        this.subiendo = false;
        this.preview = '';
        // Emitimos la URL al componente padre
        this.imagenSubida.emit(url);
      },
      error: () => {
        this.subiendo = false;
        this.preview = '';
        this.errorMsg = 'Error al subir la imagen. Intentalo de nuevo.';
      }
    });
  }

  eliminarImagen() {
    this.preview = '';
    this.imagenSubida.emit('');
  }
}