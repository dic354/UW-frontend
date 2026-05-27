import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../core/services/productos.service';
import { CarritoService } from '../../core/services/carrito.service';
import { ResenasService } from '../../core/services/resenas.service';
import { AuthService } from '../../core/services/auth.service';
import { Producto, Talla } from '../../core/models/producto.model';
import { ResenasResponse } from '../../core/models/resena.model';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.scss'
})
export class ProductoComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productosService = inject(ProductosService);
  private carritoService = inject(CarritoService);
  private resenasService = inject(ResenasService);
  private authService = inject(AuthService);

  producto: Producto | null = null;
  resenas: ResenasResponse | null = null;

  tallaSeleccionada: Talla | null = null;
  cantidad = 1;
  imagenActiva = '';
  intentoCompra = false;

  loading = true;
  addingToCart = false;
  mensajeCarrito = '';
  errorMsg = '';

  nuevaResena = { puntuacion: 5, comentario: '' };
  enviandoResena = false;

  // Todas las tallas disponibles visualmente
  tallas: Talla[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.cargarProducto(id);
      this.cargarResenas(id);
    });
  }

  cargarProducto(id: number) {
    this.loading = true;
    this.productosService.getOne(id).subscribe({
      next: (p) => {
        this.producto = p;
        this.imagenActiva = p.imagenUrl || '';
        this.tallaSeleccionada = null;
        this.intentoCompra = false;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/catalogo']);
      }
    });
  }

  cargarResenas(id: number) {
    this.resenasService.getByProducto(id).subscribe({
      next: (res) => this.resenas = res
    });
  }

  cambiarImagen(url: string) {
    this.imagenActiva = url;
  }

  incrementarCantidad() {
    if (this.producto && this.cantidad < this.producto.stock) {
      this.cantidad++;
    }
  }

  decrementarCantidad() {
    if (this.cantidad > 1) this.cantidad--;
  }

  addToCart() {
    if (!this.isLoggedIn) {
      this.router.navigate(['/auth/login']);
      return;
    }

    if (!this.producto) return;

    if (!this.tallaSeleccionada) {
      this.intentoCompra = true;
      return;
    }

    this.addingToCart = true;
    this.mensajeCarrito = '';
    this.errorMsg = '';

    this.carritoService.addItem({
      productoId: this.producto.id,
      cantidad: this.cantidad
    }).subscribe({
      next: () => {
        this.addingToCart = false;
        this.mensajeCarrito = '¡Producto añadido al carrito!';
        setTimeout(() => this.mensajeCarrito = '', 3000);
      },
      error: (err) => {
        this.addingToCart = false;
        this.errorMsg = err.error?.message || 'Error al añadir al carrito';
        setTimeout(() => this.errorMsg = '', 3000);
      }
    });
  }

  enviarResena() {
    if (!this.producto) return;

    this.enviandoResena = true;

    this.resenasService.create({
      productoId: this.producto.id,
      puntuacion: this.nuevaResena.puntuacion,
      comentario: this.nuevaResena.comentario
    }).subscribe({
      next: () => {
        this.enviandoResena = false;
        this.nuevaResena = { puntuacion: 5, comentario: '' };
        this.cargarResenas(this.producto!.id);
      },
      error: (err) => {
        this.enviandoResena = false;
        this.errorMsg = err.error?.message || 'Error al enviar la resena';
      }
    });
  }

  getEstrellas(puntuacion: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < puntuacion);
  }

  formatPrecio(precio: number): string {
    return `${Number(precio).toFixed(2)}€`;
  }
}