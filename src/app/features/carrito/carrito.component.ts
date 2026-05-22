import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CarritoService } from '../../core/services/carrito.service';
import { CarritoItem, CarritoResponse } from '../../core/models/carrito.model';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss'
})
export class CarritoComponent implements OnInit {

  private carritoService = inject(CarritoService);
  private router = inject(Router);

  carrito: CarritoResponse | null = null;
  loading = true;
  eliminando: { [key: number]: boolean } = {};
  readonly Number = Number;
  
  ngOnInit() {
    this.cargarCarrito();
  }

  cargarCarrito() {
    this.loading = true;
    this.carritoService.getCarrito().subscribe({
      next: (res) => {
        this.carrito = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  eliminarItem(id: number) {
    this.eliminando[id] = true;
    this.carritoService.removeItem(id).subscribe({
      next: () => {
        this.cargarCarrito();
      },
      error: () => {
        this.eliminando[id] = false;
      }
    });
  }

  vaciarCarrito() {
    this.carritoService.clearCarrito().subscribe({
      next: () => this.cargarCarrito()
    });
  }

  procederAlPago() {
    this.router.navigate(['/checkout']);
  }

  calcularSubtotal(): number {
    if (!this.carrito) return 0;
    return this.carrito.items.reduce((acc, item) => {
      return acc + Number(item.producto.precio) * item.cantidad;
    }, 0);
  }

  formatPrecio(precio: number | string): string {
    return `${Number(precio).toFixed(2)}€`;
  }
}