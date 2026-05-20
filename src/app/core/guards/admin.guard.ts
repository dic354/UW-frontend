import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true; // es admin, puede pasar
  }

  // Es cliente normal o no está logado
  // lo mandamos a la home
  router.navigate(['/']);
  return false;
};