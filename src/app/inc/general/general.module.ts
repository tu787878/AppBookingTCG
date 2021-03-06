import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ColorPickerModule } from 'ngx-color-picker';
import { GeneralPageRoutingModule } from './general-routing.module';

import { GeneralPage } from './general.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GeneralPageRoutingModule,
    ColorPickerModule
  ],
  declarations: [GeneralPage]
})
export class GeneralPageModule {}
