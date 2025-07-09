import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CardDetallesPageRoutingModule } from './card-detalles-routing.module';
import { modalController } from '@ionic/core';
import { CardDetallesPage } from './card-detalles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CardDetallesPageRoutingModule
  ],
  declarations: [CardDetallesPage]
})
export class CardDetallesPageModule {}
