import * as functions from 'firebase-functions';
import { generateVirgilJwt } from './generate-virgil-jwt';

export const getVirgilJwt = functions.https.onCall(async (_data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated!'
    );
  }

  const identity = context.auth.token.uid;

  const token = await generateVirgilJwt(identity);
  return { token: token.toString() };
});
