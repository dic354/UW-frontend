import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  // Si la petición va a Cloudinary NO añadimos el token
  // Cloudinary no acepta el header Authorization
  if (req.url.includes('cloudinary.com')) {
    return next(req);
  }

  const authService = inject(AuthService);
  const token = authService.getToken();

  if (!token) {
    return next(req);
  }

  const reqConToken = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });

  return next(reqConToken);
};