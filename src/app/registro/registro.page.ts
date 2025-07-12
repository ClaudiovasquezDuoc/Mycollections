import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DbserviceService } from '../services/dbservice.service'; // Importa tu servicio
import { LogrosService } from '../services/logros.service'; // Asegúrate de importar el servicio de logros


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
    private dbService: DbserviceService, // Inyecta el servicio
    private logrosService: LogrosService // Inyecta el servicio de logros
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

      // Mostrar logro (toast) por 5 segundos
      await this.logrosService.cuentaCreada(5000);

      // Luego navega a la librería
      this.router.navigate(['/libreria']);
    }
  }
}

