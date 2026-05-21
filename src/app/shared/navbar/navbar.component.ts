import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { CarritoService } from '../../core/services/carrito.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,   // ngIf, ngFor, async pipe
    RouterLink,     // [routerLink]
    RouterLinkActive // routerLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  authService = inject(AuthService);
  carritoService = inject(CarritoService);

  // Observables que el template consume con async pipe
  usuario$ = this.authService.usuario$;
  totalItems$ = this.carritoService.totalItems$;

  ngOnInit() {
    // Si hay sesión activa al cargar la app
    // cargamos el número de items del carrito
    if (this.authService.isLoggedIn()) {
      this.carritoService.getCarrito().subscribe();
    }
  }

  logout() {
    this.authService.logout();
  }
}