import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const noAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true; // no está logado, puede ver login/registro
  }

  // Ya está logado, no tiene sentido que vea el login
  // lo mandamos a la home
  router.navigate(['/']);
  return false;
};