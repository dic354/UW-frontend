import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Estado del componente
  loading = false;
  errorMsg = '';
  showPassword = false;

  // Formulario reactivo
  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(8)]]
  });

  // Getters para acceder fácilmente a los campos en el template
  get email() { return this.form.get('email')!; }
  get contrasena() { return this.form.get('contrasena')!; }

  onSubmit() {
    // Si el formulario no es válido marcamos todos los campos
    // para que se muestren los errores de validación
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    this.authService.login(this.form.value).subscribe({
      next: () => {
        // Login correcto → redirigimos a la home
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        // El backend devuelve 401 con mensaje específico
        this.errorMsg = err.error?.message || 'Correo o contraseña incorrectos';
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}