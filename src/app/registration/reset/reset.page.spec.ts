import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResetPage } from './reset.page';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment.test';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {
  Router,
  ActivatedRoute,
  Data,
  Params,
  UrlSerializer,
} from '@angular/router';
import { RouterMock } from '../registration.page.spec';
import { AuthService } from 'src/app/services/auth.service';
import { Storage } from '@ionic/storage';
import { StorageMock } from 'ionic-mocks';

const PATH = `/home`;
const fakeActivatedRoute = {
  data: {
    subscribe: (fn: (value: Data) => void) => fn({ path: PATH }),
  },
  params: {
    subscribe: (fn: (value: Params) => void) => fn({ mode: 'recoverEmail' }),
  },
  snapshot: {
    queryParamMap: {
      get: () => (mode: string) => {
        'recoveryEmail';
      },
    },
  },
};

describe('ResetPage', () => {
  let component: ResetPage;
  let fixture: ComponentFixture<ResetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResetPage],
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
      ],
      providers: [
        UrlSerializer,
        { provide: Router, useFactory: () => new RouterMock() },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        AuthService,
        { provide: Storage, useFactory: () => new StorageMock() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
