import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { ToastController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-custom-time-shop',
  templateUrl: './custom-time-shop.page.html',
  styleUrls: ['./custom-time-shop.page.scss'],
})
export class CustomTimeShopPage implements OnInit {
  data;
  currentCount = 0;
  mess;

  private sub_url = "/wp-json/bookingtcg/v1/mobile/get/custom_times";
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private storage: Storage,
    private authService: AuthGuardService,
    public toastController: ToastController,
    private http2: HTTP
  ) {
    
  }

  ionViewWillEnter() {
    this.getData();
  }

  getData() {
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;

        let url = shops[index].domain + this.sub_url;
        let parameter = "?token=" + access_token;;

        this.http2.get(url + parameter, {}, {})
          .then(data => {
            let dt = data.data.split('<br />', 1);
            dt = JSON.parse(dt);
            if (dt.status == "success") {
              this.data = dt.data;
              console.log(this.data);
              
            } else {
              this.authService.setAuthenticated(false);
              this.toastFailed();
              this.router.navigate(['login']);
            }
          })
          .catch(error => {
            this.authService.setAuthenticated(false);
            this.toastFailed();
            this.router.navigate(['login']);
            
          });
        
      });
    });
  }

  saveTimes() {
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;
        let end_url = "/wp-json/bookingtcg/v1/mobile/update/custom_times";
        let url = shops[index].domain + end_url;
        
        this.http2.post(url, {
          access_token: access_token,
          custom_times: this.data
        }, {})
        .then((data) => {
          console.log(data);
          let dt = data.data.split('<br />', 1);
          this.mess = dt;
          dt = JSON.parse(dt);
          if (dt.status == "success") {
            this.toastSuccess();
          } else {
            this.toastFailed();
          }
        })
        .catch((error) => {
          this.toastFailed();
          this.mess = error;
        });
      });
    });
   
  }

  async toastSuccess() {
    const toast = await this.toastController.create({
      message: 'Zeiten wurde gespeichern!',
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

  async toastFailed() {
    const toast = await this.toastController.create({
      message: 'Fehler! Bitte versuchen Sie noch mal!',
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }
  ngOnInit() {
  }

  new_period() {
    this.data.push(
      {
        id: "new_" + this.currentCount++,
        type: "single",
        start_date: "2023-01-01",
        end_date: "2023-01-01",
        time_type: "time_to_time",
        start_time: "00:00",
        end_time: "00:00",
        status: "close"
      });
    
  }

  deletePeriod(id) {
    this.data = this.data.filter(element => element.id != id);
  }
}
