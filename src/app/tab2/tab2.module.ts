import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { Tab2PageRoutingModule } from './tab2-routing.module';
import { CalendarModule } from 'ion2-calendar';

import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'; // a plugin!
import resourceTimegridPlugin from '@fullcalendar/resource-timegrid'; // a plugin!

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  timeGridPlugin,
  resourceTimegridPlugin,
]);

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab2PageRoutingModule,
    CalendarModule,
    FullCalendarModule
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
