import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  constructor(private afs: AngularFirestore) {}

  collection$(path: string, query?: QueryFn) {
    return this.afs
      .collection(path, query)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data: any = a.payload.doc.data();
            const id: string = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  doc$(path: string) {
    return this.afs
      .doc(path)
      .snapshotChanges()
      .pipe(
        map((doc) => {
          return { id: doc.payload.id, ...(doc.payload.data() as {}) };
        })
      );
  }

  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  updateAt(path: string, data: any): Promise<any> {
    const segments = path.split('/').filter((v) => v);
    if (segments.length % 2) {
      // odd is always a collection
      return this.afs.collection(path).add(data);
    } else {
      // even is always a document
      const dataWithTime = { ...data, updatedAt: this.timestamp };
      return this.afs.doc(path).set(dataWithTime, { merge: true });
    }
  }

  update(path: string, data: any): Promise<any> {
    return this.afs.doc(path).update({ ...data, updatedAt: this.timestamp });
  }

  set(path: string, data: any): Promise<any> {
    return this.afs
      .doc(path)
      .set(
        { ...data, updatedAt: this.timestamp, createdAt: this.timestamp },
        { merge: true }
      );
  }

  docRef(path: string) {
    return this.afs.doc(path).ref;
  }

  async upsert(path: string, data: any): Promise<any> {
    const doc = await this.docRef(path).get();
    doc.exists ? this.update(path, data) : this.set(path, data);
  }

  delete(path: string) {
    return this.afs.doc(path).delete();
  }

  generateId() {
    return this.afs.createId();
  }

  async docExists(path: string) {
    const doc = await this.docRef(path).get();
    return doc.exists;
  }

  increment(path: string, field: string, amount: number) {
    const increment = firebase.firestore.FieldValue.increment(amount);
    this.afs.doc(path).update({ [`${field}`]: increment });
  }

  decrement(path: string, field: string, amount: number) {
    const decrement = firebase.firestore.FieldValue.increment(amount);
    this.afs.doc(path).update({ [`${field}`]: decrement });
  }
}
