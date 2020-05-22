/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Login to Firebase auth using FIREBASE_AUTH_JWT environment variable
     * which is generated using firebase-admin authenticated with serviceAccount
     * during test:buildConfig phase.
     * @type {Cypress.Command}
     * @name cy.login
     * @example
     * cy.login()
     */
    login(): Chainable<any>;

    /**
     * Log out of Firebase instance
     * @memberOf Cypress.Chainable#
     * @type {Cypress.Command}
     * @name cy.logout
     * @example
     * cy.logout()
     */
    logout(): Chainable<any>;

    /**
     * Call Real Time Database path with some specified action. Authentication is through FIREBASE_TOKEN since firebase-tools is used (instead of firebaseExtra).
     * @param {String} action - The action type to call with (set, push, update, remove)
     * @param {String} actionPath - Path within RTDB that action should be applied
     * @param {Object} opts - Options
     * @param {Array} opts.args - Command line args to be passed
     * @name cy.callRtdb
     * @type {Cypress.Command}
     * @example <caption>Set Data</caption>
     * const fakeProject = { some: 'data' }
     * cy.callRtdb('set', 'projects/ABC123', fakeProject)
     * @example <caption>Set Data With Meta</caption>
     * const fakeProject = { some: 'data' }
     * // Adds createdAt and createdBy (current user's uid) on data
     * cy.callRtdb('set', 'projects/ABC123', fakeProject, { withMeta: true })
     * @example <caption>Get/Verify Data</caption>
     * cy.callRtdb('get', 'projects/ABC123')
     *   .then((project) => {
     *     // Confirm new data has users uid
     *     cy.wrap(project)
     *       .its('createdBy')
     *       .should('equal', Cypress.env('TEST_UID'))
     *   })
     * @example <caption>Other Args</caption>
     * const opts = { args: ['-d'] }
     * const fakeProject = { some: 'data' }
     * cy.callRtdb('update', 'project/test-project', fakeProject, opts)
     */
    callRtdb(
      action: string,
      actionPath: string,
      data: Object,
      opts: Array<any>
    ): Chainable<any>;

    /**
     * Call Firestore instance with some specified action. Authentication is through serviceAccount.json since it is at the base
     * level. If using delete, auth is through `FIREBASE_TOKEN` since firebase-tools is used (instead of firebaseExtra).
     * @param {String} action - The action type to call with (set, push, update, remove)
     * @param {String} actionPath - Path within RTDB that action should be applied
     * @param {Object} opts - Options
     * @param {Array} opts.args - Command line args to be passed
     * @name cy.callFirestore
     * @type {Cypress.Command}
     * @example <caption>Basic</caption>
     * cy.callFirestore('add', 'project/test-project', 'fakeProject.json')
     * @example <caption>Recursive Delete</caption>
     * const opts = { recursive: true }
     * cy.callFirestore('delete', 'project/test-project', opts)
     * @example <caption>Other Args</caption>
     * const opts = { args: ['-r'] }
     * cy.callFirestore('delete', 'project/test-project', opts)
     */
    callFirestore(
      action: string,
      actionPath: string,
      data: Object,
      opts: Array<any>
    ): Chainable<any>;

    /**
     * Login to Firebase auth using FIREBASE_AUTH_JWT environment variable
     * which is generated using firebase-admin authenticated with serviceAccount
     * during test:buildConfig phase.
     * @type {Cypress.Command}
     * @name cy.removeTestUser()
     * @example
     * cy.removeTestUser()
     */
    removeTestUser(): Chainable<any>;

    /**
     * Login to Firebase auth using FIREBASE_AUTH_JWT environment variable
     * which is generated using firebase-admin authenticated with serviceAccount
     * during test:buildConfig phase.
     * @type {Cypress.Command}
     * @name cy.finishTutorial()
     * @example
     * cy.finishTutorial()
     */
    finishTutorial(): Chainable<any>;

    /**
     * Waits until the DOM has not changed. Useful for apps that use progressive hydration
     * @type {Cypress.Command}
     * @name cy.waitUntilSettled()
     * @example
     * cy.waitUntilSettled()
     */
    waitUntilSettled(): Cypress.Chainable;
  }
}
