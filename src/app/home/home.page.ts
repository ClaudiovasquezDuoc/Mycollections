import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DatosModalComponent } from './modal.components';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  usuario = '';
  nombre = '';
  apellido = '';
  genero = '';
  nivelEducacion = '';
  fechaNacimiento = '';

  datosOriginales: any = {};

  constructor(
    private modalController: ModalController,
    private router: Router) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    const datos = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.datosOriginales = { ...datos }; // Guarda los originales
    this.usuario = datos.usuario || '';
    this.nombre = datos.nombre || '';
    this.apellido = datos.apellido || '';
    this.genero = datos.genero || '';
    this.nivelEducacion = datos.nivelEducacion || '';
    this.fechaNacimiento = datos.fechaNacimiento || '';
  }

  guardarDatos() {
    // Mantener la contraseña si existe
    const datosPrevios = JSON.parse(localStorage.getItem('usuario') || '{}');
    const datos = {
      usuario: this.usuario,
      nombre: this.nombre,
      apellido: this.apellido,
      genero: this.genero,
      nivelEducacion: this.nivelEducacion,
      fechaNacimiento: this.fechaNacimiento,
      contraseña: datosPrevios.contraseña // Mantener la contraseña existente
    };
    localStorage.setItem('usuario', JSON.stringify(datos));
  }

  limpiar() {
    this.nombre = '';
    this.apellido = '';
    this.genero = '';
    this.nivelEducacion = '';
    this.fechaNacimiento = '';
    // Si quieres limpiar también el usuario, descomenta la siguiente línea:
    // this.usuario = '';
  }

  async mostrar() {
    const modal = await this.modalController.create({
      component: DatosModalComponent,
      componentProps: {
        usuario: this.usuario,
        nombre: this.nombre,
        apellido: this.apellido,
        genero: this.genero,
        nivelEducacion: this.nivelEducacion,
        fechaNacimiento: this.fechaNacimiento
        // No incluyas contraseña aquí
      },
      cssClass: 'modal-tamano-personalizado'
    });
    await modal.present();
  }

  avanMenu() {
    this.guardarDatos();
    this.router.navigate(['/libreria']);
  }
}
