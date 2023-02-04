import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddBlockTimePage } from './add-block-time.page';

const routes: Routes = [
  {
    path: '',
    component: AddBlockTimePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddBlockTimePageRoutingModule {}
