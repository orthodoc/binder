import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { Platform } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { StorageMock } from 'ionic-mocks';
import { BehaviorSubject, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DbService } from './db.service';
import { AlertService } from './alert.service';

export class RouterMock {
  public navigateByUrl(path: string) {}
  public snapshot() {}
}

describe('AuthService', () => {
  let service: AuthService;
  let afAuth: AngularFireAuth;
  let db: DbService;
  let credsMock;
  let alert: AlertService;
  let mockUser;

  function setup() {
    const credentialsMock = {
      email: 'test@checkhealth.co',
      password: 'test123',
    };

    const userMock = {
      uid: 'ABC123',
      email: credentialsMock.email,
      displayName: 'test',
      photoUrl: '',
      isAnonymous: false,
    };

    const fakeAuthState = new BehaviorSubject(null);

    const fakeSigninHandler = (email, password): Promise<any> => {
      fakeAuthState.next(userMock);
      return Promise.resolve(userMock);
    };

    const fakeSignoutHandler = (): Promise<any> => {
      fakeAuthState.next(null);
      return Promise.resolve(null);
    };

    const angularFireAuthStub = {
      authState: fakeAuthState,
      auth: {
        createUserWithEmailAndPassword: jasmine
          .createSpy('createUserWithEmailAndPassword')
          .and.callFake(fakeSigninHandler),
        signInWithEmailAndPassword: jasmine
          .createSpy('signInWithEmailAndPassword')
          .and.callFake(fakeSigninHandler),
        signOut: jasmine.createSpy('signOut').and.callFake(fakeSignoutHandler),
        currentUser: {
          getIdTokenResult: jasmine
            .createSpy('getIdTokenResult')
            .and.returnValue({ claims: { doctor: true } }),
          reauthenticateAndRetrieveDataWithCredential: jasmine
            .createSpy('reauthenticateAndRetrieveDataWithCredential')
            .and.callThrough(),
        },
      },
    };

    const dbServiceStub = {
      updateAt: jasmine.createSpy('updateAt').and.callThrough(),
      doc$: jasmine.createSpy('doc$').and.callThrough(),
    };

    const alertServiceStub = {
      issueSuccessAlert: jasmine
        .createSpy('issueSuccessAlert')
        .and.callThrough(),
      issueErrAlert: jasmine.createSpy('issueErrAlert').and.callThrough(),
    };

    return {
      credentialsMock,
      userMock,
      fakeAuthState,
      fakeSigninHandler,
      fakeSignoutHandler,
      angularFireAuthStub,
      dbServiceStub,
      alertServiceStub,
    };
  }

  beforeEach(() => {
    const {
      angularFireAuthStub,
      userMock,
      credentialsMock,
      dbServiceStub,
      alertServiceStub,
    } = setup();
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
      ],
      providers: [
        { provide: AngularFireAuth, useValue: angularFireAuthStub },
        Platform,
        AngularFirestore,
        { provide: Router, useFactory: () => new RouterMock() },
        { provide: Storage, useFactory: () => new StorageMock() },
        { provide: DbService, useValue: dbServiceStub },
        { provide: AlertService, useValue: alertServiceStub },
      ],
    });
    service = TestBed.inject(AuthService);
    afAuth = TestBed.inject(AngularFireAuth);
    service.user$ = afAuth.authState.pipe(
      switchMap((user) => (user ? of(userMock) : of(null)))
    );
    db = TestBed.inject(DbService);
    credsMock = credentialsMock;
    alert = TestBed.inject(AlertService);
    mockUser = userMock;
    spyOn(service, 'windowReload').and.callThrough();
  });

  afterEach(() => {
    const { fakeAuthState } = setup();
    fakeAuthState.next(null);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
