import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit-parent',
  templateUrl: './edit-parent.page.html',
  styleUrls: ['./edit-parent.page.scss'],
})
export class EditParentPage implements OnInit {
  id;
  data;
  private sub_url = "/wp-json/bookingtcg/v1/mobile/get/parent";
  private head_url = "http://";
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private storage: Storage,
    private authService: AuthGuardService,
    public toastController: ToastController,
  ) {
    
  }

  ionViewWillEnter() {
    this.route.queryParams.subscribe(params => {
      this.id = params.id;
      this.getData();
    });
  }

  getData() {
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;

        let url = this.head_url + shops[index].domain + this.sub_url;
        let parameter = "?token=" + access_token + "&parent_id=" + this.id;

        this.http.get(url + parameter).subscribe((response) => {
          console.log(response);
          if (response['status'] == "success") {
            this.data = response['data'];
          } else {
            this.authService.setAuthenticated(false);
          }
        });
      });
    });
  }

  selectImage(event) {
    let elements = document.getElementsByClassName('image');
    for (let index = 0; index < elements.length; index++) {
      const element = elements[index];
      element.classList.remove("active");
    }
    event.srcElement.classList.add("active");
    this.data.detail.link_icon = event.srcElement.id;
  }

  saveParent() {
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;
        let end_url = "/wp-json/bookingtcg/v1/mobile/update/parent";
        let url = this.head_url + shops[index].domain + end_url;
        this.http.post(url, {
          access_token: access_token,
          parent_category_id: this.data.detail.parent_category_id,
          name: this.data.detail.name,
          image: this.data.detail.link_icon
        }).subscribe((response) => {
            console.log(response);
            if(response['status'] == "success"){
              this.toastSuccess();
              this.router.navigate(['tabs', 'tab3', 'parent']);
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

  async toastSuccess() {
    const toast = await this.toastController.create({
      message: 'Kategorie wurde gespeichern!',
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


}
