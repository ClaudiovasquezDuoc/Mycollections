import { Injectable } from '@angular/core';
import { DbserviceService } from '../services/dbservice.service';
import { CanActivate, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private dbService: DbserviceService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const usuarios = await this.dbService.getUsuarios();
    if (usuarios && usuarios.length > 0) {
      return true;
    } else {
      this.router.navigate(['/registro']);
      return false;
    }
  }
}