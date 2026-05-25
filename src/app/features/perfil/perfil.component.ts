import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuariosService } from '../../core/services/usuarios.service';
import { PedidosService } from '../../core/services/pedidos.service';
import { AuthService } from '../../core/services/auth.service';
import { Usuario } from '../../core/models/usuario.model';
import { Pedido } from '../../core/models/pedido.model';

type SeccionActiva = 'perfil' | 'pedidos' | 'direcciones';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {

  private usuariosService = inject(UsuariosService);
  private pedidosService = inject(PedidosService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  usuario: Usuario | null = null;
  pedidos: Pedido[] = [];
  seccionActiva: SeccionActiva = 'perfil';

  loadingUsuario = true;
  loadingPedidos = false;
  guardando = false;
  guardandoPassword = false;

  mensajeOk = '';
  errorMsg = '';
  pedidoExitoso = false;

  // Formulario perfil
  formPerfil: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: [''],
    direccion: [''],
    ciudad: [''],
    codigoPostal: ['']
  });

  // Formulario contraseña
  formPassword: FormGroup = this.fb.group({
    contrasenaActual: ['', Validators.required],
    contrasenaNueva: ['', [Validators.required, Validators.minLength(8)]]
  });

  get nombre() { return this.formPerfil.get('nombre')!; }
  get email() { return this.formPerfil.get('email')!; }

  ngOnInit() {
    this.cargarUsuario();

    // Si viene de checkout con pedido exitoso
    this.route.queryParams.subscribe(params => {
      if (params['success']) {
        this.pedidoExitoso = true;
        this.seccionActiva = 'pedidos';
        this.cargarPedidos();
        setTimeout(() => this.pedidoExitoso = false, 5000);
      }
    });
  }

  cargarUsuario() {
    this.loadingUsuario = true;
    this.usuariosService.getMe().subscribe({
      next: (u) => {
        this.usuario = u;
        this.formPerfil.patchValue({
          nombre: u.nombre,
          email: u.email,
          telefono: u.telefono || '',
          direccion: u.direccion || '',
          ciudad: u.ciudad || '',
          codigoPostal: u.codigoPostal || ''
        });
        this.loadingUsuario = false;
      },
      error: () => {
        this.loadingUsuario = false;
        this.router.navigate(['/auth/login']);
      }
    });
  }

  cargarPedidos() {
    this.loadingPedidos = true;
    this.pedidosService.getMisPedidos().subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.loadingPedidos = false;
      },
      error: () => this.loadingPedidos = false
    });
  }

  cambiarSeccion(seccion: SeccionActiva) {
    this.seccionActiva = seccion;
    this.mensajeOk = '';
    this.errorMsg = '';

    if (seccion === 'pedidos' && this.pedidos.length === 0) {
      this.cargarPedidos();
    }
  }

  guardarPerfil() {
    if (this.formPerfil.invalid) {
      this.formPerfil.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.mensajeOk = '';
    this.errorMsg = '';

    this.usuariosService.updateMe(this.formPerfil.value).subscribe({
      next: () => {
        this.guardando = false;
        this.mensajeOk = 'Datos actualizados correctamente';
        setTimeout(() => this.mensajeOk = '', 3000);
      },
      error: (err) => {
        this.guardando = false;
        this.errorMsg = err.error?.message || 'Error al guardar los datos';
      }
    });
  }

  guardarPassword() {
    if (this.formPassword.invalid) {
      this.formPassword.markAllAsTouched();
      return;
    }

    this.guardandoPassword = true;
    this.mensajeOk = '';
    this.errorMsg = '';

    this.usuariosService.changePassword(this.formPassword.value).subscribe({
      next: () => {
        this.guardandoPassword = false;
        this.mensajeOk = 'Contrasena actualizada correctamente';
        this.formPassword.reset();
        setTimeout(() => this.mensajeOk = '', 3000);
      },
      error: (err) => {
        this.guardandoPassword = false;
        this.errorMsg = err.error?.message || 'Error al cambiar la contrasena';
      }
    });
  }

  logout() {
    this.authService.logout();
  }

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