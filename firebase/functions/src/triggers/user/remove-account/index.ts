import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

exports.removeAccount = functions.firestore
  .document(`users/{userId}`)
  .onDelete(async (snap, context) => {
    const userId = context.params.userId;
    await admin.auth().deleteUser(userId);
  });
