import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { ToastController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import * as moment from 'moment';


@Component({
  selector: 'app-add-block-time',
  templateUrl: './add-block-time.page.html',
  styleUrls: ['./add-block-time.page.scss'],
})
export class AddBlockTimePage implements OnInit {
  id;
  data: any;
  resources = new Array();
  date;
  title = "Block";
  von;
  bis;

  private sub_url = '/wp-json/bookingtcg/v1/mobile/get/employees';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private storage: Storage,
    private authService: AuthGuardService,
    public toastController: ToastController,
    private http2: HTTP
  ) {}

  ionViewWillEnter() {
    this.route.queryParams.subscribe((params) => {
      this.resources.push(params.resource);
      this.date = params.date;
      this.von = this.date;
      this.bis = this.date;
      console.log(params);
      this.getData();
    });
  }

  getData() {
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;

        let url = shops[index].domain + this.sub_url;
        let parameter = '?token=' + access_token;

        this.http2
          .get(url + parameter, {}, {})
          .then((data) => {
            let dt = data.data.split('<br />', 1);
            dt = JSON.parse(dt);
            if (dt.status == 'success') {
              this.data = dt.data;
              console.log(this.data);
            } else {
              this.authService.setAuthenticated(false);
              this.toastFailed();
              this.router.navigate(['login']);
            }
          })
          .catch((error) => {
            this.authService.setAuthenticated(false);
            this.toastFailed();
            this.router.navigate(['login']);
          });
      });
    });
  }

  async toastSuccess() {
    const toast = await this.toastController.create({
      message: 'Termin wurde gespeichern',
      duration: 2000,
      color: 'success',
    });
    toast.present();
  }

  async toastFailed() {
    const toast = await this.toastController.create({
      message: 'Fehler! Bitte versuchen Sie noch mal',
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }
  ngOnInit() { }

  allClicked() {
    console.log("allll");
    
    this.resources = new Array();
    this.resources.push(this.data.employees);
  }

  saveTimes() {
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;
        let end_url = "/wp-json/bookingtcg/v1/add/block";
        let url = shops[index].domain + end_url;

        let title = this.title;
        let von = moment(this.von).format("DD/MM/YYYY HH:mm");
        let bis = moment(this.bis).format("DD/MM/YYYY HH:mm");
        let employees = this.resources;
        let appointment_id = "Bl" + (Date.now().toString(36) + Math.random().toString(36).substr(2)).substr(10);

        console.log(title, von, bis, employees);

        this.http2.post(url, {
          access_token:access_token,
          title: title,
          von: von,
          bis: bis,
          employees: employees,
          appointment_id:appointment_id
        }, {})
          .then((data) => {
            console.log(data);
            let dt = data.data.split('<br />', 1);
            dt = JSON.parse(dt);
            if (dt.status == "success") {
              this.toastSuccess();
            } else {
              this.toastFailed();
            }
          })
          .catch((error) => {
            this.toastFailed();
          });
      });
    });
  }
}
