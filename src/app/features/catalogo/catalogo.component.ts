import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../core/services/productos.service';
import { CategoriasService } from '../../core/services/categorias.service';
import { CarritoService } from '../../core/services/carrito.service';
import { AuthService } from '../../core/services/auth.service';
import { Producto, FiltroProducto, Talla } from '../../core/models/producto.model';
import { Categoria } from '../../core/models/categoria.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.scss'
})
export class CatalogoComponent implements OnInit {

  private productosService = inject(ProductosService);
  private categoriasService = inject(CategoriasService);
  private carritoService = inject(CarritoService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Datos
  productos: Producto[] = [];
  categorias: Categoria[] = [];

  // Paginación
  totalProductos = 0;
  totalPaginas = 0;
  paginaActual = 1;
  readonly LIMITE = 12;

  // Filtros activos
  filtros: FiltroProducto = {
    pagina: 1,
    limite: this.LIMITE
  };

  // Tallas disponibles
  tallas: Talla[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Estado UI
  loading = false;
  addingToCart: { [key: number]: boolean } = {};
  mensajeCarrito: { [key: number]: string } = {};

  ngOnInit() {
    // Leemos query params por si vienen de la home
    // con categoriaId preseleccionado
    this.route.queryParams.subscribe(params => {
      if (params['categoriaId']) {
        this.filtros.categoriaId = +params['categoriaId'];
      }
      this.cargarCategorias();
      this.cargarProductos();
    });
  }

  cargarCategorias() {
    this.categoriasService.getAll().subscribe({
      next: (cats) => this.categorias = cats
    });
  }

  cargarProductos() {
    this.loading = true;
    this.productosService.getAll(this.filtros).subscribe({
      next: (res) => {
        this.productos = res.datos;
        this.totalProductos = res.total;
        this.totalPaginas = res.totalPaginas;
        this.paginaActual = res.pagina;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // Filtrar por categoría
  filtrarPorCategoria(categoriaId?: number) {
    this.filtros.categoriaId = categoriaId;
    this.filtros.pagina = 1;
    this.cargarProductos();
  }

  // Aplicar filtros de talla/color/precio
  aplicarFiltros() {
    this.filtros.pagina = 1;
    this.cargarProductos();
  }

  // Limpiar todos los filtros
  limpiarFiltros() {
    this.filtros = { pagina: 1, limite: this.LIMITE };
    this.cargarProductos();
  }

  // Cambiar página
  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.filtros.pagina = pagina;
    this.paginaActual = pagina;
    this.cargarProductos();
    // Scroll al inicio del catálogo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Añadir al carrito
  addToCart(producto: Producto, event: Event) {
    // Detenemos la propagación para que no
    // navegue al detalle del producto
    event.stopPropagation();

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    if (producto.stock === 0) return;

    this.addingToCart[producto.id] = true;

    this.carritoService.addItem({
      productoId: producto.id,
      cantidad: 1
    }).subscribe({
      next: () => {
        this.addingToCart[producto.id] = false;
        this.mensajeCarrito[producto.id] = 'ok';
        // Reseteamos el mensaje después de 2 segundos
        setTimeout(() => {
          delete this.mensajeCarrito[producto.id];
        }, 2000);
      },
      error: () => {
        this.addingToCart[producto.id] = false;
        this.mensajeCarrito[producto.id] = 'error';
        setTimeout(() => {
          delete this.mensajeCarrito[producto.id];
        }, 2000);
      }
    });
  }

  // Array de páginas para la paginación
  getPaginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  formatPrecio(precio: number): string {
    return `${Number(precio).toFixed(2)}€`;
  }
}