import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LogrosService {

  private rangos = [1, 3, 5, 7, 10];
  private cuenta = 0;

  constructor(private alertController: AlertController) { }

  aumentarCuenta() {
    this.cuenta++;
    this.verificarLogro();
  }

  verificarLogro() {
    const rangoActual = this.rangos.find(rango => rango === this.cuenta);
    if (rangoActual) {
      this.mostrarLogro(rangoActual);
    }
  }

  async mostrarLogro(rango: number) {
    const alert = await this.alertController.create({
      header: '¡Logro desbloqueado!',
      message: `Has alcanzado el rango ${rango} de logros.`,
      buttons: ['Aceptar']
    });
    await alert.present();
  }

}