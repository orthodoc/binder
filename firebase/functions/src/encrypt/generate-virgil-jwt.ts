import { JwtGenerator } from 'virgil-sdk';
import {
  initCrypto,
  VirgilCrypto,
  VirgilAccessTokenSigner,
} from 'virgil-crypto';
import * as functions from 'firebase-functions';

async function getJwtgenerator() {
  await initCrypto();

  const crypto = new VirgilCrypto();

  const { appid, appkeyid, appkey } = functions.config().virgil;

  return new JwtGenerator({
    appId: appid,
    apiKeyId: appkeyid,
    apiKey: crypto.importPrivateKey(appkey),
    accessTokenSigner: new VirgilAccessTokenSigner(crypto),
  });
}

export async function generateVirgilJwt(identity: string) {
  const generator = await getJwtgenerator();
  return generator.generateToken(identity);
}
