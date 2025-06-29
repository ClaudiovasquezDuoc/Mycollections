import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false
})
export class RegistroPage {
  showPassword = false;
  registroForm: FormGroup;



  constructor(private fb: FormBuilder, private router: Router) {
    this.registroForm = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')
      ]],
      apellido: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')
      ]],
      contraseña: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{4}$')
      ]],
      nivelEducacion: ['', Validators.required],
      fechaNacimiento: [null, Validators.required],
      genero: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registroForm.valid) {
      const datos = this.registroForm.value;
      localStorage.setItem('usuarioData', JSON.stringify(datos));
      this.router.navigate(['/libreria']);
    }
  }
}

