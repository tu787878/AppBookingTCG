import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomTimeShopPage } from './custom-time-shop.page';

const routes: Routes = [
  {
    path: '',
    component: CustomTimeShopPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomTimeShopPageRoutingModule {}
