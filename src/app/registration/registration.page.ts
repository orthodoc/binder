import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  constructor(
    public auth: AuthService,
    public formBuilder: FormBuilder,
    public router: Router,
    public loadingCtrl: LoadingController
  ) {}

  signupEmailForm: FormGroup;
  passwordFieldType = true;

  ngOnInit() {
    this.signupEmailForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });
  }

  async signupUser() {
    const signupLoader = await this.loadingCtrl.create({
      message: 'Creating your account...',
    });
    await signupLoader.present();
    const email = this.signupEmailForm.get('email').value;
    const password = this.signupEmailForm.get('password').value;
    await this.auth
      .signupWithEmailAndPassword(email, password)
      .then(async (cred) => {
        if (cred) {
          await this.router.navigateByUrl('/home');
        } else {
          await this.router.navigateByUrl('/registration');
        }
        await signupLoader.dismiss();
      });
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

  togglePasswordFieldType() {
    this.passwordFieldType = !this.passwordFieldType;
  }
}
