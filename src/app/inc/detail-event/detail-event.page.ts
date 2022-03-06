import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { ToastController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-detail-event',
  templateUrl: './detail-event.page.html',
  styleUrls: ['./detail-event.page.scss'],
})
export class DetailEventPage implements OnInit {
  id;
  data: any;
  private cors = "https://cors-anywhere.herokuapp.com/";

  private sub_url = "/wp-json/bookingtcg/v1/mobile/get/event";
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private storage: Storage,
    private authService: AuthGuardService,
    public toastController: ToastController,
    private http2: HTTP,
  ) {
    
  }

  ionViewWillEnter() {
    this.route.queryParams.subscribe(params => {
      this.id = params.id;
      console.log('kakaka');
      
      this.getData();
    });
  }

  getData() {
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;

        let url = shops[index].domain + this.sub_url;
        let parameter = "?token=" + access_token + "&event_id=" + this.id;

        this.http2.get(url + parameter, {}, {})
          .then(data => {
            let dt = data.data.split('<br />', 1);
            
            dt = JSON.parse(dt);
            if (dt.status == "success") {
              this.data = dt.data;
              console.log(this.data);
              
            } else {
              this.authService.setAuthenticated(false);
              this.router.navigate(['login']);
            }
          })
          .catch(error => {

            this.authService.setAuthenticated(false);
            this.router.navigate(['login']);

          });
      });
    });
  }

  saveService() {
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;
        let end_url = "/wp-json/bookingtcg/v1/mobile/update/service";
        let url = this.cors + shops[index].domain + end_url;

        this.http.post(url, {
          access_token: access_token,
          service_id: this.data.service.service_id,
          name: this.data.service.name,
          category_id: this.data.service.category_id,
          status: this.data.service.status,
          description: this.data.service.description,
          price: this.data.service.price,
          time: this.data.service.time
        }).subscribe((response) => {
            console.log(response);
            if(response['status'] == "success"){
              this.toastSuccess();
            } else {
              this.toastFailed();
            }
        },
          (err) => {
            this.toastFailed();
          }
        );
      });
    });
   
  }

  done_appointment() {
    console.log("done");
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let url = shops[index].domain + '/wp-admin/admin-ajax.php';
        this.http2.post(url, {
          action: "done_appointment",
          id: this.data.detail.id,
          appointment_id: this.data.detail.appointment_id,
        }, {})
          .then(data => {
            this.toastSuccess();
            this.getData();
          })
          .catch(error => {
            this.toastFailed();
          });
      });
    });
  }

  delete_appointment() {
    console.log("delete");
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let url = shops[index].domain + '/wp-admin/admin-ajax.php';
        this.http2.post(url, {
          action: "delete_appointment",
          id: this.data.detail.id,
          appointment_id: this.data.detail.appointment_id,
        }, {})
          .then(data => {
            this.toastSuccess();
            this.router.navigate(['/tabs/tab2']);
          })
          .catch(error => {
            this.toastFailed();
          });
      });
    });
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
  ngOnInit() {
  }

}
