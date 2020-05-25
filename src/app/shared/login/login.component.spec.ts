import { async, TestBed } from '@angular/core/testing';
import { IonicModule, LoadingController } from '@ionic/angular';
import { LoginComponent } from './login.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment.test';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { RouterMock } from 'src/app/registration/registration.page.spec';
import { Storage } from '@ionic/storage';
import { StorageMock, LoadingControllerMock } from 'ionic-mocks';
import { AuthService } from '../../services/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProfileComponent } from '../profile/profile.component';
import { AngularFirestore } from '@angular/fire/firestore';

export class AuthMock {
  public signupWithEmailAndPassword() {
    return Promise.resolve();
  }
  public updateRole() {}
}

describe('LoginComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent, ProfileComponent],
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
        {
          provide: LoadingController,
          useFactory: () => new LoadingControllerMock(),
        },
      ],
    }).compileComponents();
  }));

  function setup() {
    const fixture = TestBed.createComponent(LoginComponent);
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
