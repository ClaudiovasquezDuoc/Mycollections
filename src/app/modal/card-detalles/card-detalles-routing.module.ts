import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CardDetallesPage } from './card-detalles.page';

const routes: Routes = [
  {
    path: '',
    component: CardDetallesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardDetallesPageRoutingModule {}
