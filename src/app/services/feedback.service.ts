import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Toast } from '@capacitor/toast';
@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  constructor(
    public loadingController: LoadingController,
    public alertController: AlertController
  ) {}

  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async showToast(toastText: string) {
    await Toast.show({
      text: toastText,
    });
  }

  async createLoading(){
    const loading = await this.loadingController.create();
    return loading;
  }

}
