import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// ping api
import * as pb from './ping';
export const pingApi = functions.https.onRequest(pb.pingBase);

// Callable functions
import * as _generateVirgilJwt from './encrypt';
export const generateVirgilJwt = _generateVirgilJwt;

// Triggers (run in the backgroudn when called - non interactive)
import * as _removeAccount from './triggers/user/remove-account';
export const account = _removeAccount;
