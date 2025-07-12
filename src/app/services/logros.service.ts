import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LogrosService {
  private cuentaLibros = 0;
  private logroPrimerLibro = false;
  private logroTercerLibro = false;
  private logroCuenta = false;
  private logroPrimerResena = false;

  constructor(private toastController: ToastController) { }

  // Llama esto al crear un libro
  libroCreado() {
    this.cuentaLibros++;
    if (this.cuentaLibros === 1 && !this.logroPrimerLibro) {
      this.logroPrimerLibro = true;
      this.mostrarLogro('Has creado tu primer libro.');
    }
    if (this.cuentaLibros === 3 && !this.logroTercerLibro) {
      this.logroTercerLibro = true;
      this.mostrarLogro('Has creado tres libros.');
    }
  }

  // Llama esto al crear la cuenta por primera vez
  async cuentaCreada(duration: number = 3500) {
    if (!this.logroCuenta) {
      this.logroCuenta = true;
      this.mostrarLogro('Has creado tu cuenta.');
    }
  }

  // Llama esto al agregar la primera reseña
  resenaAgregada() {
    if (!this.logroPrimerResena) {
      this.logroPrimerResena = true;
      this.mostrarLogro('Has agregado tu primera reseña.');
    }
  }

  private async mostrarLogro(mensaje: string) {
    const toast = await this.toastController.create({
      header: '¡Logro desbloqueado!',
      message: `👍 ${mensaje}`,
      duration: 3500,
      color: 'secondary',
      position: 'top',
      cssClass: 'logro-toast',
      animated: true,
      buttons: [
        {
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    toast.present();
  }
}