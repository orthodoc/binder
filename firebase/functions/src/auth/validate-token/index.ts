import * as express from 'express';
import * as admin from 'firebase-admin';

export interface RequestWithFirebaseUser extends express.Request {
  user: admin.auth.DecodedIdToken;
}

export const validateToken = async (
  req: RequestWithFirebaseUser,
  res: express.Response,
  next: express.NextFunction
) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')
  ) {
    console.error(
      'no firebase ID token was passed as a Bearer token in the Authorizatio header',
      'Make sure you authorize your request by providing the following HTTP header',
      'Authorization: Bearer <Firebase ID Token>'
    );
    res.status(403).send({ msg: 'Unauthorized' });
    return;
  }

  const idToken: string = req.headers.authorization.split('Bearer ')[1];
  await admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedIdToken: any) => {
      req.user = decodedIdToken;
      next();
    })
    .catch((err: any) => {
      console.error(err);
      res.status(401).send({ msg: 'Unauthorized' });
    });
};
