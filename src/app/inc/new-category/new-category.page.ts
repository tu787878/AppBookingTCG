import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { ToastController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.page.html',
  styleUrls: ['./new-category.page.scss'],
})
export class NewCategoryPage implements OnInit {
  data: any;
  name: string;
  parent_category_id: string;
  status = "1";
  mess;

  private sub_url = "/wp-json/bookingtcg/v1/mobile/get/parents";
  constructor(
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

        let url =  shops[index].domain + this.sub_url;
        let parameter = "?token=" + access_token;

        this.http2.get(url + parameter, {}, {})
          .then(data => {
            let dt = data.data.split('<br />', 1);
            dt = JSON.parse(dt);
            if (dt.status == "success") {
              this.data = dt.data;
            } else {
              this.authService.setAuthenticated(false);
              this.toastFailed("failed");
              this.router.navigate(['login']);
            }
          })
          .catch(error => {
            this.authService.setAuthenticated(false);
            this.toastFailed(error);
            this.router.navigate(['login']);
            
          });
      });
    });
  }

  saveCategory() {
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;
        let end_url = "/wp-json/bookingtcg/v1/mobile/new/category";
        let url = shops[index].domain + end_url;
        let category_id = "C" + (Date.now().toString(36) + Math.random().toString(36).substr(2)).substr(10);
        console.log(category_id);
        
        this.http2.post(url, {
          access_token: access_token,
          category_id: category_id,
          name: this.name,
          parent_category_id: this.parent_category_id,
          status: this.status
        }, {})
          .then((data) => {
          console.log(data);
          let dt = data.data.split('<br />', 1);
            dt = JSON.parse(dt);
            this.mess = dt;
            
          if (dt.status == "success") {
            this.toastSuccess();
            this.router.navigate(['tabs', 'tab3', 'category']);
          } else {
            this.toastFailed("failed");
          }
        })
        .catch((error) => {
          this.toastFailed(error);
          this.mess = "error";
        });
        /*
        this.http.post(url, {
          access_token: access_token,
          category_id: category_id,
          name: this.name,
          parent_category_id: this.parent_category_id,
          status: this.status
        }).subscribe((response) => {
            console.log(response);
            if(response['status'] == "success"){
              this.toastSuccess();
              this.router.navigate(['tabs', 'tab3', 'category']);
            } else {
              this.toastFailed();
            }
        },
          (err) => {
            this.toastFailed();
          }
        );

        */
      });
    });
   
  }

  async toastSuccess() {
    const toast = await this.toastController.create({
      message: 'Kategorie wurde gespeichern',
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

  async toastFailed(mess) {
    const toast = await this.toastController.create({
      message: mess,
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }
  ngOnInit() {
  }


}
