import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule, // Para usar el async pipe con el estado del usuario
    RouterLink    // Para habilitar el uso de routerLink en el HTML
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  
  // Inyectamos el servicio Auth
  authService = inject(AuthService);

  // Compartimos el flujo del usuario con el HTML usando el pipe async
  usuario$ = this.authService.usuario$;
}