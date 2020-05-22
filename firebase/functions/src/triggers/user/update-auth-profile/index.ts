import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

exports.updateProfile = functions.firestore
  .document(`users/{userId}`)
  .onWrite(async (change, context) => {
    const previousData = change.before.data();
    const currentData = change.after.exists ? change.after.data() : null;
    const uid = context.params.userId;
    if (previousData!.displayName !== currentData!.displayName) {
      await admin
        .auth()
        .updateUser(uid, { displayName: currentData!.displayName });
    }
    if (previousData!.photoURL !== currentData!.photoURL) {
      await admin.auth().updateUser(uid, { photoURL: currentData!.photoURL });
    }
    if (previousData!.email !== currentData!.email) {
      await admin.auth().updateUser(uid, { email: currentData!.email });
    }
  });
