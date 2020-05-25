import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { RegistrationPage } from './registration.page';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

export class LoadingMock {
  public create() {
    return new LoadingMock();
  }
  public dismiss() {}
  public present() {}
}

export class AuthMock {
  public signupWithEmailAndPassword() {
    return Promise.resolve();
  }
  public updateRole() {}
}

export class RouterMock {
  public navigateByUrl(path) {}
  public snapshot() {}
}

describe('RegistrationPage', () => {
  const emailString = 'email';
  const pwdString = 'password';
  const reqString = 'required';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, FormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        FormBuilder,
        { provide: AuthService, useClass: AuthMock },
        { provide: Router, useClass: RouterMock },
        { provide: LoadingController, useClass: LoadingMock },
      ],
    }).compileComponents();
  }));

  function setup() {
    const fixture = TestBed.createComponent(RegistrationPage);
    fixture.detectChanges();
    const component = fixture.debugElement.componentInstance;
    component.ngOnInit();
    component.router = new RouterMock();
    return { fixture, component };
  }

  afterEach(() => {
    const { fixture, component } = setup();
    fixture.destroy();
  });

  it('should create', () => {
    const { component } = setup();
    expect(component).toBeTruthy();
  });

  it('signupEmailForm should be invalid when empty', () => {
    const { component } = setup();
    expect(component.signupEmailForm.valid).toBeFalsy();
  });

  it('email field should be invalid when empty', () => {
    const { component } = setup();
    const email = component.signupEmailForm.controls[emailString];
    email.setValue('');
    const errors = component.errors || {};
    expect(email.valid).toBeFalsy();
  });

  it('email field should be invalid with `test`', () => {
    const { component } = setup();
    const email = component.signupEmailForm.controls[emailString];
    email.setValue('test');
    expect(email.valid).toBeFalsy();
  });

  it('email field should be valid with `test@getbinder.net` ', () => {
    const { component } = setup();
    const email = component.signupEmailForm.controls[emailString];
    email.setValue('test@getbinder.net');
    expect(email.valid).toBeTruthy();
  });

  it('password field should be invalid when empty', () => {
    const { component } = setup();
    const password = component.signupEmailForm.controls[pwdString];
    const errors = password.errors || {};
    expect(password.valid).toBeFalsy();
    expect(errors[reqString]).toBeTruthy();
  });

  it('password field should be invalid with `test1` ', () => {
    const { component } = setup();
    const password = component.signupEmailForm.controls[pwdString];
    password.setValue('test1');
    expect(password.valid).toBeFalsy();
  });

  it('password field should be valid with `test12` ', () => {
    const { component } = setup();
    const password = component.signupEmailForm.controls[pwdString];
    password.setValue('test12');
    expect(password.valid).toBeTruthy();
  });
});
