import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductosService } from '../../core/services/productos.service';
import { CategoriasService } from '../../core/services/categorias.service';
import { Producto } from '../../core/models/producto.model';
import { Categoria } from '../../core/models/categoria.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  private productosService = inject(ProductosService);
  private categoriasService = inject(CategoriasService);

  // Últimos 3 productos para "Nuevas llegadas"
  nuevasLlegadas: Producto[] = [];

  // Categorías para "Colecciones destacadas"
  categorias: Categoria[] = [];

  // Email del newsletter
  newsletterEmail = '';
  newsletterEnviado = false;

  loading = true;

  ngOnInit() {
    this.cargarNuevasLlegadas();
    this.cargarCategorias();
  }

  cargarNuevasLlegadas() {
    this.productosService.getAll({ limite: 3, pagina: 1 }).subscribe({
      next: (res) => {
        this.nuevasLlegadas = res.datos;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  cargarCategorias() {
    this.categoriasService.getAll().subscribe({
      next: (cats) => {
        // Máximo 3 categorías para las colecciones destacadas
        this.categorias = cats.slice(0, 3);
      }
    });
  }

  suscribirNewsletter() {
    if (this.newsletterEmail) {
      // Por ahora solo simulamos el envío
      // en el futuro se puede conectar a un servicio de email
      this.newsletterEnviado = true;
      this.newsletterEmail = '';
    }
  }

  // Formatea el precio con € y 2 decimales
  formatPrecio(precio: number): string {
    return `${Number(precio).toFixed(2)}€`;
  }
}