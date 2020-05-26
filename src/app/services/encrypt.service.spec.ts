import { TestBed } from '@angular/core/testing';

import { EncryptService } from './encrypt.service';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment.test';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { Storage } from '@ionic/storage';
import { StorageMock } from 'ionic-mocks';

describe('EncryptService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule
      ],
      providers: [
        AngularFireAuth,
        { provide: Storage, useFactory: () => StorageMock}
      ]
    });
  });

  it('should be created', () => {
    const service: EncryptService = TestBed.get(EncryptService);
    expect(service).toBeTruthy();
  });
});
