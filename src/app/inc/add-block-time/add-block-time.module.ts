import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddBlockTimePageRoutingModule } from './add-block-time-routing.module';

import { AddBlockTimePage } from './add-block-time.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddBlockTimePageRoutingModule
  ],
  declarations: [AddBlockTimePage]
})
export class AddBlockTimePageModule {}
