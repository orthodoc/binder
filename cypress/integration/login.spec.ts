import { environment } from '../../src/environments/environment.test';

describe('Login', () => {
  beforeEach(() => {
    cy.logout();
    cy.visit('/home').then(() => {
      cy.get('#splash-screen').should('not.be.visible');
    });
  });

  after(() => {
    cy.logout();
  });

  it('should successfully sign in a user', () => {
    cy.get('#login-email > .native-input').type(
      environment.testUser.login.email,
      { force: true }
    );
    cy.get('#login-password > .native-input').type(
      environment.testUser.login.pwd,
      { force: true }
    );
    cy.get('#login-button').click({ force: true });
    cy.wait(5000);
    cy.get('#login-button').should('not.be.visible');
    const testUserName = environment.testUser.login.email
      .split('@')[0]
      .toUpperCase();
    cy.get('ion-card-title').should('contain', testUserName);
  });

  it('should not login a user without a valid form', () => {
    cy.get('#login-email > .native-input').type('bdb', { force: true });
    cy.get('#login-password > .native-input').type('be$t', { force: true });
    cy.get('#login-button').should('have.class', 'button-disabled');
    cy.get('#login-logo').click({ force: true }); // simulating a click outside the form
    cy.get('ion-item.error-message').should(($items) => {
      expect($items).to.have.length(2);
    });
  });
});
