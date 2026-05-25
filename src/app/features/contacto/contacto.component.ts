import { Component, inject } from '@angular/core'; // 👈 Añadido 'inject' aquí
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.scss'
})
export class ContactoComponent {

  // 1. Inyectamos de forma limpia el FormBuilder de Angular
  private fb = inject(FormBuilder);

  // Estado del componente
  enviado = false;
  enviando = false;

  // 2. Construimos el formulario reactivo directamente aquí arriba
  form: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    asunto: ['', [Validators.required, Validators.minLength(3)]],
    mensaje: ['', [Validators.required, Validators.minLength(10)]]
  });

  // Getters para acceder fácilmente a los campos en el template HTML
  get nombre() { return this.form.get('nombre')!; }
  get email() { return this.form.get('email')!; }
  get asunto() { return this.form.get('asunto')!; }
  get mensaje() { return this.form.get('mensaje')!; }

  onSubmit() {
    // Si el formulario no es válido, forzamos que se muestren los errores
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando = true;

    // Simulación del envío de datos
    setTimeout(() => {
      this.enviando = false;
      this.enviado = true;
      this.form.reset(); // Limpia los campos del formulario tras el éxito
    }, 1500);
  }
}