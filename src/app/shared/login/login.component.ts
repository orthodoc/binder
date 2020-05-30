import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    public auth: AuthService,
    public formBuilder: FormBuilder,
    public router: Router,
    public loadingCtrl: LoadingController
  ) {}

  loginForm: FormGroup;
  passwordFieldType = true;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });
  }

  async loginUser() {
    const loginLoader = await this.loadingCtrl.create({
      message: 'Loggining into your account...',
    });
    await loginLoader.present();
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    return this.auth
      .loginWithEmailAndPassword(email, password)
      .then(async () => {
        await loginLoader.dismiss();
        const passwordString = 'password';
        this.loginForm.controls[passwordString].reset();
        await this.router.navigate(['/home']);
      });
  }

  getIconName() {
    return this.passwordFieldType ? 'eye-outline' : 'eye-off-outline';
  }

  getPasswordFieldType() {
    return this.passwordFieldType ? 'password' : 'text';
  }

  getPasswordPlaceholder() {
    return this.passwordFieldType ? 'Password' : 'Be$t12';
  }

  togglePasswordFieldType() {
    this.passwordFieldType = !this.passwordFieldType;
  }

  async openRegistration() {
    await this.router.navigateByUrl('/registration');
  }

  async openResetPassword() {
    await this.router.navigateByUrl('/registration/reset');
  }
}
