import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
})
export class ResetPage implements OnInit {
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public auth: AuthService,
    public alerter: AlertService,
    public loadingCtrl: LoadingController
  ) {}

  reqPasswordResetForm: FormGroup;
  mode: string;
  actionCode: string;
  continueUrl: string;
  lang: string;
  resetPasswordForm: FormGroup;
  securedEmail = false;
  verifiedEmail = false;
  passwordFieldType = true;

  ngOnInit() {
    this.mode = this.getParamByName('mode');
    console.log(this.mode);
    this.actionCode = this.getParamByName('oobCode');
    console.log(this.actionCode);
    this.continueUrl = this.getParamByName('continueUrl');
    this.lang = this.getParamByName('lang');

    this.resetPasswordForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      oldPassword: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
      newPassword: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });

    if (this.mode === 'resetPassword') {
      this.auth
        .verifyPasswordResetCode(this.actionCode)
        .then((email) => {
          console.log(email);
          this.resetPasswordForm.get('email').setValue(email);
        })
        .catch((error) => {
          console.error(error.message);
          this.alerter.issueErrAlert(error, 'Reset password');
        });
    }

    if (this.mode === 'recoverEmail') {
      this.handleRecoverEmail();
    }
    if (this.mode === 'verifyEmail') {
      this.handleVerifyEmail();
    }

    this.reqPasswordResetForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });

    this.resetPasswordForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      oldPassword: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
      newPassword: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });
  }

  public getParamByName(name: string) {
    return this.activatedRoute.snapshot.queryParamMap.get(name);
  }

  public async setEmail(user: firebase.User) {
    this.reqPasswordResetForm.get('email').setValue(user.email);
    this.reqPasswordResetForm.get('email').disable();
  }

  private async handleRecoverEmail() {
    try {
      const info = await this.auth.checkActionCode(this.actionCode);
      const restoredEmail = info.data.email;
      await this.auth.applyActionCode(this.actionCode);
      this.securedEmail = true;
      await this.alerter.issueSuccessAlert(
        'Email secured. Check inbox for password recovery.',
        'Email recovery'
      );
      await this.auth.sendPasswordResetEmail(restoredEmail);
      await this.router.navigateByUrl('/home');
    } catch (err) {
      console.error(err);
      this.alerter.issueErrAlert(err, 'Recover email');
    }
  }

  private async handleVerifyEmail() {
    try {
      await this.auth.applyActionCode(this.actionCode);
      this.verifiedEmail = true;
      await this.alerter.issueSuccessAlert('Email verified', 'Verify email');
      await this.router.navigateByUrl('/home');
    } catch (err) {
      console.error(err);
      this.alerter.issueErrAlert(err, 'Verify email');
    }
  }

  public async reqResetPassword() {
    try {
      let email: string;
      const currentUser = await this.auth.currentUser;
      if (currentUser) {
        email = currentUser.email;
      } else {
        email = this.reqPasswordResetForm.value.email;
      }
      console.log(email);
      await this.auth.sendPasswordResetEmail(email);
    } catch (error) {
      console.error(error);
      await this.alerter.issueErrAlert(error, 'Request reset password');
    }
  }

  public async handleResetPassword() {
    const resetPasswordLoader = await this.loadingCtrl.create({
      message: 'Reset password in progress...',
    });
    try {
      await resetPasswordLoader.present();
      const currentUser = await this.auth.currentUser;
      console.log(currentUser);
      const newPassword = await this.resetPasswordForm.value.newPassword;
      if (!currentUser) {
        await this.auth.confirmPasswordReset(this.actionCode, newPassword);
      } else {
        const oldPassword = await this.resetPasswordForm.value.oldPassword;
        await this.auth
          .loginWithEmailAndPassword(currentUser.email, oldPassword)
          .then(async () => {
            await this.auth.confirmPasswordReset(this.actionCode, newPassword);
          });
      }
      this.alerter
        .issueSuccessAlert(
          'Password was changed successfully.',
          'Password reset'
        )
        .then(async () => {
          await this.auth.logOut();
        });
      await resetPasswordLoader.dismiss();
      await this.router.navigateByUrl('/home');
    } catch (error) {
      console.error(error);
      await resetPasswordLoader.dismiss();
      await this.alerter.issueErrAlert(error, 'Reset password');
    }
  }

  getIconName() {
    return this.passwordFieldType ? 'eye-outline' : 'eye-off-outline';
  }

  getPasswordFieldType() {
    return this.passwordFieldType ? 'password' : 'text';
  }

  getPasswordPlaceholder() {
    return this.passwordFieldType ? '******' : 'Ad3&jh';
  }

  getResetNewPasswordPlaceholder() {
    return this.passwordFieldType ? 'New Password' : 'Ad3&jh';
  }

  getResetOldPasswordPlaceholder() {
    return this.passwordFieldType ? 'Your Old Password' : 'Be$t04';
  }

  togglePasswordFieldType() {
    this.passwordFieldType = !this.passwordFieldType;
  }

  async goToHomePage() {
    await this.router.navigateByUrl('/home');
  }
}
