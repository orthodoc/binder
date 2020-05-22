import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(public alertCtrl: AlertController) {}

  public async issueErrAlert(err: Error, process?: string) {
    let subHeader: string;
    process
      ? (subHeader = `${process} process error`)
      : (subHeader = `Processing error.`);
    const errAlert = await this.alertCtrl.create({
      header: `Error!!`,
      subHeader,
      message: err.message,
      buttons: ['OK'],
    });
    return errAlert.present();
  }

  public async issueSuccessAlert(msg: string, process?: string) {
    let subHeader: string;
    process
      ? (subHeader = `${process} was successful`)
      : (subHeader = `Processing was successful`);
    const successAlert = await this.alertCtrl.create({
      header: 'Success!!',
      subHeader,
      message: msg,
      buttons: ['OK'],
    });
  }
}
