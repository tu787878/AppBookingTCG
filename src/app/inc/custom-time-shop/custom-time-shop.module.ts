import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomTimeShopPageRoutingModule } from './custom-time-shop-routing.module';

import { CustomTimeShopPage } from './custom-time-shop.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomTimeShopPageRoutingModule
  ],
  declarations: [CustomTimeShopPage]
})
export class CustomTimeShopPageModule {}
