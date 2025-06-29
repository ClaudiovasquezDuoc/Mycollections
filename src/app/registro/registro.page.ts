import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DbserviceService } from '../services/dbservice.service'; // Importa tu servicio


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false
})
export class RegistroPage {
  showPassword = false;
  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dbService: DbserviceService // Inyecta el servicio
  ) {
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

  async onSubmit() {
    if (this.registroForm.valid) {
      const datos = this.registroForm.value;
      await this.dbService.addUsuario(
        datos.nombre,
        datos.apellido,
        datos.contraseña,
        datos.nivelEducacion,
        datos.fechaNacimiento,
        datos.genero
      );
      // Guarda el nombre en localStorage para mostrarlo en la librería
      localStorage.setItem('usuarioNombre', datos.nombre);
      this.router.navigate(['/libreria']);
    }
  }
}

