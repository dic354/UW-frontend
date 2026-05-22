import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CarritoService } from '../../core/services/carrito.service';
import { PedidosService } from '../../core/services/pedidos.service';
import { DescuentosService } from '../../core/services/descuentos.service';
import { UsuariosService } from '../../core/services/usuarios.service';
import { CarritoResponse } from '../../core/models/carrito.model';
import { MetodoPago } from '../../core/models/pedido.model';
import { ValidacionDescuento } from '../../core/models/descuento.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private carritoService = inject(CarritoService);
  private pedidosService = inject(PedidosService);
  private descuentosService = inject(DescuentosService);
  private usuariosService = inject(UsuariosService);
  readonly Number = Number;

  carrito: CarritoResponse | null = null;
  descuento: ValidacionDescuento | null = null;

  loading = true;
  procesando = false;
  errorMsg = '';

  // Descuento
  codigoDescuento = '';
  validandoDescuento = false;
  errorDescuento = '';

  metodosPago: { valor: MetodoPago; label: string; icono: string }[] = [
    { valor: 'tarjeta', label: 'Tarjeta de crédito/débito', icono: 'bi-credit-card' },
    { valor: 'paypal', label: 'PayPal', icono: 'bi-paypal' },
    { valor: 'transferencia', label: 'Transferencia bancaria', icono: 'bi-bank' }
  ];

  form: FormGroup = this.fb.group({
    direccionEnvio: ['', [Validators.required, Validators.minLength(5)]],
    ciudadEnvio: ['', [Validators.required, Validators.minLength(2)]],
    codigoPostalEnvio: ['', [Validators.required, Validators.minLength(5)]],
    metodoPago: ['tarjeta', Validators.required]
  });

  get direccionEnvio() { return this.form.get('direccionEnvio')!; }
  get ciudadEnvio() { return this.form.get('ciudadEnvio')!; }
  get codigoPostalEnvio() { return this.form.get('codigoPostalEnvio')!; }
  get metodoPago() { return this.form.get('metodoPago')!; }

  ngOnInit() {
    this.cargarCarrito();
    this.cargarDatosUsuario();
  }

  cargarCarrito() {
    this.carritoService.getCarrito().subscribe({
      next: (res) => {
        this.carrito = res;
        this.loading = false;
        // Si el carrito está vacío redirigimos
        if (res.items.length === 0) {
          this.router.navigate(['/carrito']);
        }
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/carrito']);
      }
    });
  }

  // Precargamos la dirección del perfil del usuario
  cargarDatosUsuario() {
    this.usuariosService.getMe().subscribe({
      next: (usuario) => {
        if (usuario.direccion) {
          this.form.patchValue({
            direccionEnvio: usuario.direccion,
            ciudadEnvio: usuario.ciudad || '',
            codigoPostalEnvio: usuario.codigoPostal || ''
          });
        }
      }
    });
  }

  validarDescuento() {
    if (!this.codigoDescuento.trim()) return;

    this.validandoDescuento = true;
    this.errorDescuento = '';
    this.descuento = null;

    this.descuentosService.validar({ codigo: this.codigoDescuento }).subscribe({
      next: (res) => {
        this.descuento = res;
        this.validandoDescuento = false;
      },
      error: (err) => {
        this.validandoDescuento = false;
        this.errorDescuento = err.error?.message || 'Codigo no valido';
        this.descuento = null;
      }
    });
  }

  quitarDescuento() {
    this.descuento = null;
    this.codigoDescuento = '';
    this.errorDescuento = '';
  }

  calcularSubtotal(): number {
    if (!this.carrito) return 0;
    return this.carrito.items.reduce((acc, item) => {
      return acc + Number(item.producto.precio) * item.cantidad;
    }, 0);
  }

  calcularDescuento(): number {
    if (!this.descuento) return 0;
    return this.calcularSubtotal() * Number(this.descuento.porcentaje) / 100;
  }

  calcularTotal(): number {
    return this.calcularSubtotal() - this.calcularDescuento();
  }

  formatPrecio(precio: number): string {
    return `${Number(precio).toFixed(2)}€`;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.procesando = true;
    this.errorMsg = '';

    const dto = {
      ...this.form.value,
      codigoDescuento: this.descuento?.codigo
    };

    this.pedidosService.create(dto).subscribe({
      next: (pedido) => {
        this.procesando = false;
        // Redirigimos al perfil con el id del pedido
        this.router.navigate(['/perfil'], {
          queryParams: { pedidoId: pedido.id, success: true }
        });
      },
      error: (err) => {
        this.procesando = false;
        this.errorMsg = err.error?.message || 'Error al procesar el pedido';
      }
    });
  }
}