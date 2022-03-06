import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { AuthGuardService } from '../services/auth-guard.service';
import { CalendarOptions, FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import allLocales from '@fullcalendar/core/locales-all';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  events: any[] = [];
  resources: any[] = [];
  calendarOptions: CalendarOptions = {
    locales: allLocales,
    locale:'de',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'resourceTimeGridDay,dayGridMonth'
    },
    initialView: 'resourceTimeGrid',
    selectable: true,
    navLinks: true,
    allDaySlot: false,
    editable: true,
    eventTimeFormat: {
      // like '14:30:00'
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
  };

  private sub_url = "/wp-json/bookingtcg/v1/mobile/get/events";
  date: string;
  data;
  d;
  mess;
  load: boolean = true;
  type: 'moment'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private authService: AuthGuardService,
    private router: Router,
    public toastController: ToastController,
    private http2: HTTP,
  ) { }

  ionViewWillEnter() {
    this.getData();
  }
  
  changeDate($event) {
    this.d = moment(this.date).format('YYYY-MM-DD');
  }

  doRefresh(event) {
    this.getData();
    event.target.complete();
  }

  getData() {
    setTimeout(() => {
      this.load = true;
      this.storage.get('shops').then((shops) => {
        this.storage.get('active_shop').then((index) => {
          let url = shops[index].domain + '/wp-json/bookingtcg/v1/admin' + '/load_appointment';
          this.http2.get(url, {}, {})
            .then(data => {
              let dt = data.data.split('<br />', 1);
              dt = JSON.parse(dt);
              this.events = [];
              dt.forEach(element => {
                this.events.push(element);
              });
                console.log(this.events);
            })
            .catch(error => {
            });
          
            url = shops[index].domain + '/wp-json/bookingtcg/v1/admin' + '/load_resources';
            this.http2.get(url, {}, {})
              .then(data => {
                let dt = data.data.split('<br />', 1);
                dt = JSON.parse(dt);
                this.resources = [];
                dt.forEach(element => {
                 
                  this.resources.push(element);
                });
                  console.log(dt);
              })
              .catch(error => {
              });
        });
      });
    }, 2200);
    setTimeout(() => {
      this.load = false;
      this.calendarOptions = {
        locales: allLocales,
        locale:'de',
        headerToolbar: {
          left: 'prev,next',
          center: 'title',
          right: 'resourceTimeGridDay,dayGridMonth'
        },
        initialView: 'resourceTimeGrid',
        events: this.events,
        selectable: true,
        navLinks: true,
        allDaySlot: false,
        editable: true,
        eventTimeFormat: {
          // like '14:30:00'
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        },
        resources: this.resources,
        eventResize: (data) => {
          let start1 = data.event.start;
          let start = start1.toDateString() + '' + start1.getHours() + ':' + start1.getMinutes() + ':' + start1.getSeconds();
          let end1 = data.event.end;
          let end = end1.toDateString() + '' + end1.getHours() + ':' + end1.getMinutes() + ':' + end1.getSeconds();
          let id = data.event.id;
          let resourceId = '';

          console.log(end);
          this.eventUpdate(start, end, id, resourceId);
        },
        eventDrop: (data) => {
          let start1 = data.event.start;
          let start = start1.toDateString() + '' + start1.getHours() + ':' + start1.getMinutes() + ':' + start1.getSeconds();
          let end1 = data.event.end;
          let end = end1.toDateString() + '' + end1.getHours() + ':' + end1.getMinutes() + ':' + end1.getSeconds();
          let id = data.event.id;
          let resourceId = data.newResource != null ? data.newResource.id : '';

          console.log(resourceId);
          this.eventUpdate(start, end, id, resourceId);
        },
        eventClick: (data) => {
          let id = data.event.id;
          this.toDetail(id);
        }
      };
    }, 2500);
  }

  toDetail(event) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: event
      }
    };
    console.log(navigationExtras)
    this.router.navigate(['tabs', 'tab2', 'detail-event'], navigationExtras);
  }

  eventUpdate(start, end, id, resourceId) {
    console.log(start);
    console.log(end);
    console.log(id);
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;

        let url = shops[index].domain + '/wp-admin/admin-ajax.php';

        this.http2.post(url, {
          action: "update_calender",
          id: id,
          start: start,
          end: end,
          resourceId: resourceId,
        }, {})
          .then(data => {
            this.toastSuccess();
          })
          .catch(error => {
            this.toastFailed();
          });
      });
    });
  }

  changeToggle(e:any) {
    
   
  }

  async toastSuccess() {
    const toast = await this.toastController.create({
      message: 'Termin wurde gespeichern',
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

  async toastFailed() {
    const toast = await this.toastController.create({
      message: 'Fehler! Bitte versuchen Sie noch mal',
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }
}
