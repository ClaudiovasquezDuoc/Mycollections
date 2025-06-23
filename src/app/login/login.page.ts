import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {

  usuario: string = '';
  contrasena: string = '';

  constructor(private router: Router) {}

  ingresar() {
    if (this.usuario && this.contrasena) {
      localStorage.setItem('usuario', this.usuario);
      this.router.navigate(['/libreria']);
    } else {
      alert('Ingrese usuario y contraseña correctamente');
    }
  }
  irRegistro(){
    this.router.navigate(['/registro']);
  }
}
