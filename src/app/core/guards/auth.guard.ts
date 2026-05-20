import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // tiene token, puede pasar
  }

  // No tiene token, lo mandamos al login
  // guardamos la URL a la que intentaba ir
  // para redirigirle después del login
  router.navigate(['/auth/login']);
  return false;
};