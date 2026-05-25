import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [

  // ─── RUTAS PÚBLICAS ──────────────────────────────────
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'catalogo',
    loadComponent: () =>
      import('./features/catalogo/catalogo.component').then(m => m.CatalogoComponent)
  },
  {
    path: 'producto/:id',
    loadComponent: () =>
      import('./features/producto/producto.component').then(m => m.ProductoComponent)
  },

  // ─── RUTAS DE AUTH (solo sin sesión) ─────────────────
  {
    path: 'auth',
    canActivate: [noAuthGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },

  // ─── RUTAS PRIVADAS (requieren login) ────────────────
  {
    path: 'carrito',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/carrito/carrito.component').then(m => m.CarritoComponent)
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'perfil',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/perfil/perfil.component').then(m => m.PerfilComponent)
  },
  {
  path: 'contacto',
  loadComponent: () =>
    import('./features/contacto/contacto.component').then(m => m.ContactoComponent)
  },

  // ─── RUTAS DE ADMIN (requieren rol administrador) ────
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/admin.component').then(m => m.AdminComponent)
  },

  // ─── RUTA COMODÍN ────────────────────────────────────
  {
  path: '**',
  loadComponent: () =>
    import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];