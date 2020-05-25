import { async, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileComponent } from './profile.component';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment.test';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { RouterMock } from 'src/app/registration/registration.page.spec';
import { Storage } from '@ionic/storage';
import { StorageMock } from 'ionic-mocks';
import { AuthService } from 'src/app/services/auth.service';

export class AuthMock {
  public loginWithEmailAndPassword() {
    return Promise.resolve();
  }
}

describe('ProfileComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileComponent, LoginComponent],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        IonicModule.forRoot(),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        AngularFirestore,
        { provide: Router, useFactory: () => new RouterMock() },
        { provide: Storage, useFactory: () => new StorageMock() },
        { provide: AuthService, useClass: AuthMock },
      ],
    }).compileComponents();
  }));

  function setup() {
    const fixture = TestBed.createComponent(ProfileComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
    return { fixture, component };
  }

  afterEach(() => {
    const { fixture, component } = setup();
    fixture.destroy();
  });

  it('should create', () => {
    const component = setup();
    expect(component).toBeTruthy();
  });
});
