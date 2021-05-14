import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimeShopPage } from './time-shop.page';

const routes: Routes = [
  {
    path: '',
    component: TimeShopPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimeShopPageRoutingModule {}
