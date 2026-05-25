import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProductosService } from '../../core/services/productos.service';
import { CategoriasService } from '../../core/services/categorias.service';
import { PedidosService } from '../../core/services/pedidos.service';
import { DescuentosService } from '../../core/services/descuentos.service';
import { Producto, CreateProductoDto, Talla } from '../../core/models/producto.model';
import { Categoria } from '../../core/models/categoria.model';
import { Pedido, EstadoPedido } from '../../core/models/pedido.model';
import { Descuento } from '../../core/models/descuento.model';

type SeccionAdmin =
  'dashboard' | 'productos' | 'categorias' | 'pedidos' | 'descuentos';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {

  private productosService = inject(ProductosService);
  private categoriasService = inject(CategoriasService);
  private pedidosService = inject(PedidosService);
  private descuentosService = inject(DescuentosService);
  private fb = inject(FormBuilder);

  seccionActiva: SeccionAdmin = 'dashboard';

  // Datos
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  pedidos: Pedido[] = [];
  descuentos: Descuento[] = [];

  // Stats dashboard
  stats = {
    totalProductos: 0,
    totalPedidos: 0,
    totalCategorias: 0,
    totalDescuentos: 0
  };

  // Estados UI
  loading = false;
  guardando = false;
  errorMsg = '';
  mensajeOk = '';

  // Modal producto
  modalProductoAbierto = false;
  productoEditando: Producto | null = null;

  // Modal categoria
  modalCategoriaAbierto = false;
  categoriaEditando: Categoria | null = null;

  // Modal descuento
  modalDescuentoAbierto = false;
  descuentoEditando: Descuento | null = null;

  tallas: Talla[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  estadosPedido: EstadoPedido[] = [
    'pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'
  ];

  readonly Number = Number;

  // Formulario producto
  formProducto: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    descripcion: [''],
    precio: [0, [Validators.required, Validators.min(0)]],
    categoriaId: [null, Validators.required],
    stock: [0, [Validators.required, Validators.min(0)]],
    talla: [null],
    color: [''],
    imagenUrl: [''],
    activo: [true]
  });

  // Formulario categoria
  formCategoria: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    descripcion: [''],
    imagenCategoria: ['']
  });

  // Formulario descuento
  formDescuento: FormGroup = this.fb.group({
    codigo: ['', [Validators.required, Validators.minLength(3)]],
    porcentaje: [10, [Validators.required, Validators.min(1), Validators.max(100)]],
    fechaInicio: ['', Validators.required],
    fechaFin: ['', Validators.required],
    usosMaximos: [null],
    activo: [true]
  });

  ngOnInit() {
    this.cargarDashboard();
  }

  cambiarSeccion(seccion: SeccionAdmin) {
    this.seccionActiva = seccion;
    this.errorMsg = '';
    this.mensajeOk = '';

    switch (seccion) {
      case 'productos': this.cargarProductos(); break;
      case 'categorias': this.cargarCategorias(); break;
      case 'pedidos': this.cargarPedidos(); break;
      case 'descuentos': this.cargarDescuentos(); break;
    }
  }

  cargarDashboard() {
    this.productosService.getAll({ limite: 1 }).subscribe({
      next: (res) => this.stats.totalProductos = res.total
    });
    this.pedidosService.getAll().subscribe({
      next: (p) => this.stats.totalPedidos = p.length
    });
    this.categoriasService.getAll().subscribe({
      next: (c) => this.stats.totalCategorias = c.length
    });
    this.descuentosService.getAll().subscribe({
      next: (d) => this.stats.totalDescuentos = d.length
    });
  }

  // ─── PRODUCTOS ────────────────────────────────────────
  cargarProductos() {
    this.loading = true;
    this.productosService.getAll({ limite: 50 }).subscribe({
      next: (res) => {
        this.productos = res.datos;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  abrirModalProducto(producto?: Producto) {
    this.productoEditando = producto || null;
    this.errorMsg = '';

    if (producto) {
      this.formProducto.patchValue({
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        precio: producto.precio,
        categoriaId: producto.categoriaId,
        stock: producto.stock,
        talla: producto.talla || null,
        color: producto.color || '',
        imagenUrl: producto.imagenUrl || '',
        activo: producto.activo
      });
    } else {
      this.formProducto.reset({
        precio: 0, stock: 0, activo: true, talla: null
      });
    }

    if (this.categorias.length === 0) this.cargarCategorias();
    this.modalProductoAbierto = true;
  }

  cerrarModalProducto() {
    this.modalProductoAbierto = false;
    this.productoEditando = null;
    this.formProducto.reset();
  }

  guardarProducto() {
    if (this.formProducto.invalid) {
      this.formProducto.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.errorMsg = '';

    const dto = this.formProducto.value;

    const obs = this.productoEditando
      ? this.productosService.update(this.productoEditando.id, dto)
      : this.productosService.create(dto);

    obs.subscribe({
      next: () => {
        this.guardando = false;
        this.cerrarModalProducto();
        this.cargarProductos();
        this.mensajeOk = this.productoEditando
          ? 'Producto actualizado' : 'Producto creado';
        setTimeout(() => this.mensajeOk = '', 3000);
      },
      error: (err) => {
        this.guardando = false;
        this.errorMsg = err.error?.message || 'Error al guardar';
      }
    });
  }

  eliminarProducto(id: number) {
    if (!confirm('¿Desactivar este producto?')) return;
    this.productosService.delete(id).subscribe({
      next: () => this.cargarProductos()
    });
  }

  // ─── CATEGORIAS ───────────────────────────────────────
  cargarCategorias() {
    this.loading = true;
    this.categoriasService.getAll().subscribe({
      next: (cats) => {
        this.categorias = cats;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  abrirModalCategoria(categoria?: Categoria) {
    this.categoriaEditando = categoria || null;
    this.errorMsg = '';

    if (categoria) {
      this.formCategoria.patchValue({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || '',
        imagenCategoria: categoria.imagenCategoria || ''
      });
    } else {
      this.formCategoria.reset();
    }

    this.modalCategoriaAbierto = true;
  }

  cerrarModalCategoria() {
    this.modalCategoriaAbierto = false;
    this.categoriaEditando = null;
    this.formCategoria.reset();
  }

  guardarCategoria() {
    if (this.formCategoria.invalid) {
      this.formCategoria.markAllAsTouched();
      return;
    }

    this.guardando = true;

    const obs = this.categoriaEditando
      ? this.categoriasService.update(this.categoriaEditando.id, this.formCategoria.value)
      : this.categoriasService.create(this.formCategoria.value);

    obs.subscribe({
      next: () => {
        this.guardando = false;
        this.cerrarModalCategoria();
        this.cargarCategorias();
        this.mensajeOk = 'Categoria guardada';
        setTimeout(() => this.mensajeOk = '', 3000);
      },
      error: (err) => {
        this.guardando = false;
        this.errorMsg = err.error?.message || 'Error al guardar';
      }
    });
  }

  eliminarCategoria(id: number) {
    if (!confirm('¿Eliminar esta categoria?')) return;
    this.categoriasService.delete(id).subscribe({
      next: () => this.cargarCategorias(),
      error: (err) => {
        this.errorMsg = err.error?.message || 'Error al eliminar';
      }
    });
  }

  // ─── PEDIDOS ──────────────────────────────────────────
  cargarPedidos() {
    this.loading = true;
    this.pedidosService.getAll().subscribe({
      next: (p) => {
        this.pedidos = p;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  actualizarEstadoPedido(pedidoId: number, estado: EstadoPedido) {
    this.pedidosService.updateEstado(pedidoId, { estado }).subscribe({
      next: () => {
        const pedido = this.pedidos.find(p => p.id === pedidoId);
        if (pedido) pedido.estado = estado;
        this.mensajeOk = 'Estado actualizado';
        setTimeout(() => this.mensajeOk = '', 2000);
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Error al actualizar estado';
      }
    });
  }

  // ─── DESCUENTOS ───────────────────────────────────────
  cargarDescuentos() {
    this.loading = true;
    this.descuentosService.getAll().subscribe({
      next: (d) => {
        this.descuentos = d;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  abrirModalDescuento(descuento?: Descuento) {
    this.descuentoEditando = descuento || null;
    this.errorMsg = '';

    if (descuento) {
      this.formDescuento.patchValue({
        codigo: descuento.codigo,
        porcentaje: descuento.porcentaje,
        fechaInicio: descuento.fechaInicio.split('T')[0],
        fechaFin: descuento.fechaFin.split('T')[0],
        usosMaximos: descuento.usosMaximos || null,
        activo: descuento.activo
      });
    } else {
      this.formDescuento.reset({ porcentaje: 10, activo: true });
    }

    this.modalDescuentoAbierto = true;
  }

  cerrarModalDescuento() {
    this.modalDescuentoAbierto = false;
    this.descuentoEditando = null;
    this.formDescuento.reset();
  }

  guardarDescuento() {
    if (this.formDescuento.invalid) {
      this.formDescuento.markAllAsTouched();
      return;
    }

    this.guardando = true;

    const obs = this.descuentoEditando
      ? this.descuentosService.update(
          this.descuentoEditando.id,
          this.formDescuento.value
        )
      : this.descuentosService.create(this.formDescuento.value);

    obs.subscribe({
      next: () => {
        this.guardando = false;
        this.cerrarModalDescuento();
        this.cargarDescuentos();
        this.mensajeOk = 'Descuento guardado';
        setTimeout(() => this.mensajeOk = '', 3000);
      },
      error: (err) => {
        this.guardando = false;
        this.errorMsg = err.error?.message || 'Error al guardar';
      }
    });
  }

  eliminarDescuento(id: number) {
    if (!confirm('¿Eliminar este descuento?')) return;
    this.descuentosService.delete(id).subscribe({
      next: () => this.cargarDescuentos()
    });
  }

  // ─── HELPERS ──────────────────────────────────────────
  getEstadoClass(estado: string): string {
    const clases: { [key: string]: string } = {
      pendiente: 'estado-pendiente',
      procesando: 'estado-procesando',
      enviado: 'estado-enviado',
      entregado: 'estado-entregado',
      cancelado: 'estado-cancelado'
    };
    return clases[estado] || '';
  }

  formatPrecio(precio: number): string {
    return `${Number(precio).toFixed(2)}€`;
  }
}