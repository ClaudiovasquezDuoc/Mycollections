import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DbserviceService } from '../services/dbservice.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {

  usuario: string = '';
  contrasena: string = '';
  usuarioInvalido = false;

  constructor(
    private router: Router,
    private dbService: DbserviceService,
    private alertController: AlertController
  ) {}

  async ingresar() {
    const usuarios = await this.dbService.getUsuarios();
    if (!usuarios || usuarios.length === 0) {
      this.usuarioInvalido = true;
      const alert = await this.alertController.create({
        header: 'Sin usuarios',
        message: 'No hay usuarios registrados. Debe registrarse primero.',
        buttons: [
          {
            text: 'Ir a registro',
            handler: () => {
              this.irRegistro();
            }
          },
          {
            text: 'Cerrar',
            role: 'cancel'
          }
        ]
      });
      await alert.present();
      return;
    }
    this.router.navigate(['/libreria']);
  }

  irRegistro() {
    this.router.navigate(['/registro']);
  }
}
