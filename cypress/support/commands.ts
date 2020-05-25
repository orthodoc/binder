import { environment } from '../../src/environments/environment.test';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { attachCustomCommands } from 'cypress-firebase/lib';

const fbConfig = environment.firebase;

const fbInstance = firebase.initializeApp(fbConfig);

if (fbInstance) {
  (window as any).fbInstance = fbInstance;
}

attachCustomCommands({ Cypress, cy, firebase });

Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

Cypress.Commands.add('removeSignupUser', async () => {
  const currentUser = firebase.auth().currentUser;
  await firebase.firestore().doc(`users/${currentUser.uid}`).delete();
  await firebase.auth().signOut();
});

/* Cypress.Commands.add('waitUntilSettled', () => {
  // Prevent an infinite loop
  const maxTries = 20;

  let didDOMChange = false;

  const handleMutation = () => {
    didDOMChange = true;
  };

  // First install a MutationObserver on the document that will fire the
  // callback on any DOM node changes, and set the `didDOMChange` boolean to
  // true. Later we will wait a little bit and see if it has been fired.
  const observer = new MutationObserver(handleMutation);
  cy.document().then((doc) => {
    observer.observe(doc, { childList: true, subtree: true });
  });

  function waitAndSee(iteration: number) {
    didDOMChange = false;

    // Here we wait until the next idle callback, and then check our
    // `didDOMChange` boolean. If it changed, we repeat this process, and if it
    // has not changed, we allow the test to continue.
    //
    // Since requestIdleCallback will wait until the CPU is idle before it
    // resolves, and there might be a lot of work happening on the page, the
    // amount of time that takes could be greater than the Cypress timeout
    // (default of 4000ms). To make sure that we don't blow past that timeout
    // and fail the test, we want to control the timeouts ourselves here.
    //
    // Here we are going to use two different timeouts: one for the Cypress
    // .then() and another, smaller timeout for our requestIdleCallback. I
    // decided to make sure that the requestIdleCallback timeout is quite a bit
    // lower than the .then() timeout because if there is a long blocking task,
    // it will need to finish before the idle callback will have a chance to
    // land. Given that we are calling this in a loop and checking to see if the
    // DOM has changed, I think this will be okay because if there was DOM work
    // being done and there is still more work to be done, we'll just recurse on
    // to the next iteration and check again in a few seconds.
    const thenTimeout = 8000;
    cy.window()
      .then(
        { timeout: thenTimeout },
        (win) =>
          new Cypress.Promise((resolve) =>
            win.requestIdleCallback(resolve, { timeout: thenTimeout / 2 })
          )
      )
      .then(() => {
        if (didDOMChange) {
          if (iteration >= maxTries) {
            throw new Error('DOM did not settle');
          }

          waitAndSee(iteration + 1);
        }
      });
  }

  waitAndSee(0);
}); */
