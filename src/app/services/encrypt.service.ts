import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Storage } from '@ionic/storage';
import jwtDecode from 'jwt-decode';
import { EThree } from '@virgilsecurity/e3kit-browser/dist'
const ab2Str = require('arraybuffer-to-string');
import { take, map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class EncryptService {
  constructor(
    public afAuth: AngularFireAuth, 
    public storage: Storage,
    public afFunc: AngularFireFunctions
    ) {}

  // prettier-ignore
  private getVirgilJwt = () => async () => {
    let tokenExpired = true;
    let identity: string;
    const currentUser = await this.afAuth.currentUser;
    if (currentUser) { identity = currentUser.uid; }
    const storedToken = await this.storage.get(`${identity}.encryptToken`);
    if (storedToken) {
      const decodedToken: any = jwtDecode(storedToken);
      console.log(decodedToken.exp);
      const timeNow = new Date().getTime() / 1000;
      decodedToken.exp < timeNow ? tokenExpired = true : tokenExpired = false;
    }
    if (tokenExpired) {
      const virgilJwtFunc = this.afFunc.httpsCallable('getVirgilJwt');
      const token$ = virgilJwtFunc({});
      const token = token$.pipe(take(1), map((token) => token)).toPromise();
      console.log(token);
    } else {
      return storedToken;
    }
  }

  public async checkHasPrivateKey() {
    const token = this.getVirgilJwt();
    const E3 = await EThree.initialize(token);
    return E3.hasLocalPrivateKey();
  }

  public async register() {
    const token = this.getVirgilJwt();
    console.log(token);
    const E3 = await EThree.initialize(token);
    return E3.register();
  }

  public async getPublicKeys(identity: string) {
    const storedPublicKey = this.storage.get(identity);
    if (storedPublicKey) {
      return storedPublicKey;
    } else {
      const token = this.getVirgilJwt();
      const E3 = await EThree.initialize(token);
      const publicKey = await E3.lookupPublicKeys(identity);
      if (publicKey) {
        this.storage.set(identity, publicKey);
      }
      return publicKey;
    }
  }

  public async getKeyNumber(identity: string) {
    const publicKey = await this.getPublicKeys(identity);
    return ab2Str(publicKey.identifier, 'hex');
  }

  // enable multiple device at registration
  public async backupPrivateKey(password: string) {
    const token = this.getVirgilJwt();
    const E3 = await EThree.initialize(token);
    return E3.backupPrivateKey(password);
  }

  // restore private key in new device
  public async restorePrivateKey(password: string) {
    const token = this.getVirgilJwt();
    const E3 = await EThree.initialize(token);
    const hasPrivateKey = await E3.hasLocalPrivateKey();
    if (!hasPrivateKey) {
      await E3.restorePrivateKey(password);
    }
    return;
  }

  // when user wants to restrict to single device use
  public async deleteBackedUpPrivateKey(password: string) {
    const token = await this.getVirgilJwt();
    const E3 = await EThree.initialize(token);
    return E3.resetPrivateKeyBackup(password);
  }

  // user changes password
  public async backupWithNewPassword(oldPassword: string, newPassword: string) {
    const token = this.getVirgilJwt();
    const E3 = await EThree.initialize(token);
    return E3.changePassword(oldPassword, newPassword);
  }

  // user accessed on a temporary device and wants to clear up before loggin out
  public async deleteLocalPrivateKey() {
    const token = this.getVirgilJwt();
    const E3 = await EThree.initialize(token);
    return E3.cleanup();
  }

  // encrypt message
  public async encryptMessage(msg: string, identities: string[]) {
    const token = this.getVirgilJwt();
    const E3 = await EThree.initialize(token);
    const publicKeys = await E3.lookupPublicKeys(identities);
    return E3.encrypt(msg, publicKeys);
  }

  // decrypt message
  public async decryptMessage(encryptedMsg: ArrayBuffer, senderId: string) {
    const token = this.getVirgilJwt();
    const E3 = await EThree.initialize(token);
    const senderPublicKey = await E3.lookupPublicKeys(senderId);
    return E3.decrypt(encryptedMsg, senderPublicKey);
  }
}
