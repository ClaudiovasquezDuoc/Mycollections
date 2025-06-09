import { Component, Input } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-datos-modal',
  imports: [IonicModule],
  template: `
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>Usuario</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-label><strong>Su nombre es:</strong></ion-label>
          <ion-text>{{ nombre }} {{ apellido }}</ion-text>
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-footer>
      <ion-buttons class="ion-text-center" expand="block">
        <ion-button (click)="cerrar()">Yes</ion-button>
      </ion-buttons>
    </ion-footer>
  `,
  styleUrls: ['./modal.components.scss'],
})
export class DatosModalComponent {
  @Input() nombre!: string;
  @Input() apellido!: string;
  @Input() nivelEducacion!: string;
  @Input() fechaNacimiento!: string;

  constructor(private modalCtrl: ModalController) {}

  cerrar() {
    this.modalCtrl.dismiss();
  }
}