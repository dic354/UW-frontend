import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

// Validador personalizado que comprueba que
// contraseña y confirmar contraseña coincidan
function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const contrasena = control.get('contrasena');
  const confirmar = control.get('confirmarContrasena');

  if (contrasena && confirmar && contrasena.value !== confirmar.value) {
    return { passwordsMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;
  errorMsg = '';
  successMsg = '';
  showPassword = false;
  showConfirm = false;

  form: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(8)]],
    confirmarContrasena: ['', Validators.required]
  }, { validators: passwordsMatch }); // validador a nivel de formulario

  // Getters
  get nombre() { return this.form.get('nombre')!; }
  get email() { return this.form.get('email')!; }
  get contrasena() { return this.form.get('contrasena')!; }
  get confirmarContrasena() { return this.form.get('confirmarContrasena')!; }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    // Solo enviamos los campos que espera el backend
    // no enviamos confirmarContrasena
    const { confirmarContrasena, ...dto } = this.form.value;

    this.authService.register(dto).subscribe({
      next: () => {
        // Registro correcto → redirigimos al login con mensaje
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 409) {
          this.errorMsg = 'Este correo ya está registrado';
        } else {
          this.errorMsg = err.error?.message || 'Error al crear la cuenta';
        }
      }
    });
  }

  togglePassword() { this.showPassword = !this.showPassword; }
  toggleConfirm() { this.showConfirm = !this.showConfirm; }
}