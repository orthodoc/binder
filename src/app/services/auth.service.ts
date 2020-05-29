import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';
import { DbService } from './db.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertService } from './alert.service';
import { switchMap, take, map } from 'rxjs/operators';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<any>;
  baseUrl = environment.fnBaseUrl;

  constructor(
    private afAuth: AngularFireAuth,
    private db: DbService,
    private router: Router,
    private storage: Storage,
    public alerter: AlertService
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => (user ? db.doc$(`users/${user.uid}`) : of(null)))
    );
  }

  uid() {
    return this.user$
      .pipe(
        take(1),
        map((u) => u && u.uid)
      )
      .toPromise();
  }

  get currentUser() {
    return this.afAuth.currentUser;
  }

  async updateAuthProfile(user: firebase.User) {
    let displayName = user.displayName;
    if (!displayName) {
      const email = user.email;
      displayName = email.split('@')[0];
    }
    const photoURL = user.photoURL;
    // const profile = { displayName, photoURL };
    const currentUser = await this.afAuth.currentUser;
    let profile = {};
    if (currentUser.displayName && currentUser.photoURL) {
      return;
    } else if (!currentUser.displayName && !currentUser.photoURL) {
      profile = { displayName, photoURL };
    } else if (!currentUser.displayName && currentUser.photoURL) {
      profile = { displayName, photoURL: currentUser.photoURL };
    } else if (currentUser.displayName && !currentUser.photoURL) {
      profile = { displayName: currentUser.displayName, photoURL };
    } else {
      return;
    }
    currentUser.updateProfile(profile);
  }

  private async updateUserData({
    uid,
    email,
    displayName,
    photoURL,
    isAnonymous,
  }) {
    const path = `users/${uid}`;
    const data = { uid, email, displayName, photoURL, isAnonymous };
    const currentUser = await this.afAuth.currentUser;
    const result = await currentUser.getIdTokenResult();
    const isDoctorStatus = { isDoctor: result.claims.doctor || false };
    const userData = { ...data, ...isDoctorStatus };
    return this.db.updateAt(path, userData);
  }

  async sendVerificationEmail() {
    const baseUrl = environment.baseUrl;
    const currentUser = await this.afAuth.currentUser;
    const currentUserEmail = currentUser.emailVerified;
    const actionCodeSettings = {
      url: `${baseUrl}/registration/reset-password?email=${currentUserEmail}`,
      ios: { bundleId: environment.bundleId },
      android: {
        packageName: environment.packageName,
        installApp: true,
        minimumVersion: '5.0.0',
      },
      handleCodeInApp: false,
      dynamicLinkDomain: environment.dynamicLinkDomain,
    };
    await currentUser.sendEmailVerification(actionCodeSettings);
  }

  async signupWithEmailAndPassword(email: string, password: string) {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      // await this.updateAuthProfile(userCredential.user);
      await this.updateUserData(userCredential.user);
      await this.sendVerificationEmail();
      await this.storage.set('registrationComplete', true);
      return userCredential;
    } catch (err) {
      console.error(err);
      if (this.afAuth.currentUser) {
        await this.removeAccount();
      }
      return this.alerter.issueErrAlert(err, 'Signup');
    }
  }

  async loginWithEmailAndPassword(email: string, password: string) {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      // await this.updateUserData(userCredential.user);
      const currentUser = await this.afAuth.currentUser;
      console.log(currentUser.photoURL);
      if (!currentUser.emailVerified) {
        this.sendVerificationEmail();
      }
    } catch (err) {
      console.error(err);
      return this.alerter.issueErrAlert(err, 'Login');
    }
  }

  async windowReload() {
    return window.location.reload();
  }

  async logOut() {
    this.user$.subscribe(async (user) => {
      console.log(user);
      if (user) {
        await this.afAuth.signOut().then(async () => {
          await this.storage.remove(`${user.id}.encryptToken`);
        });
      }
    });
    await this.router.navigateByUrl('/home');
    await this.windowReload();
  }

  async removeAccount() {
    const currentUser = await this.afAuth.currentUser;
    const userRef = await this.db.docRef(`users/${currentUser.uid}`).get();
    if (userRef.exists) {
      this.db.delete(`users/${currentUser.uid}`);
    } else {
      firebase.auth().currentUser.delete();
    }
  }

  async sendPasswordResetEmail(
    email: string,
    actionCodeSettings?: firebase.auth.ActionCodeSettings
  ) {
    try {
      await this.afAuth.sendPasswordResetEmail(email, actionCodeSettings);
      return this.alerter.issueSuccessAlert(
        'Check your email inbox. Open the link in the email to reset your password',
        'Request reset password'
      );
    } catch (error) {
      console.error(error);
      return this.alerter.issueErrAlert(error, 'Request to reset email');
    }
  }

  async verifyPasswordResetCode(code: string) {
    try {
      return await this.afAuth.verifyPasswordResetCode(code);
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async confirmPasswordReset(code: string, newPassword: string) {
    try {
      await this.afAuth.confirmPasswordReset(code, newPassword);
    } catch (error) {
      console.error(error);
      await this.alerter.issueErrAlert(error, 'Reset password');
    }
  }

  async checkActionCode(code: string) {
    try {
      return this.afAuth.checkActionCode(code);
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async applyActionCode(code: string) {
    try {
      this.afAuth.applyActionCode(code);
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }
}
