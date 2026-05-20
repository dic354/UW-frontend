import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// En Angular 18 los interceptores son funciones, no clases
// HttpInterceptorFn es el tipo que Angular espera
export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
) => {
    const authService = inject(AuthService);
    const token = authService.getToken();

    // Si no hay token, dejamos pasar la petición sin modificar
    // Esto aplica a endpoints públicos: GET /productos, GET /categorias...
    if (!token) {
        return next(req);
    }

    // Si hay token, clonamos la petición y añadimos el header
    // Las peticiones HTTP son inmutables en Angular, por eso hay que clonar
    const reqConToken = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next(reqConToken);
};