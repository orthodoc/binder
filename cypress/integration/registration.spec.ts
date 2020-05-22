import { environment } from '../../src/environments/environment.test';

describe('Registration page', () => {
  beforeEach(() => {
    cy.visit('/registration');
    cy.get('#splash-screen').should('not.be.visible');
  });

  after(() => {
    cy.removeTestUser();
  });

  it('should not register user without a valid form', () => {
    cy.get('#signup-email > .native-input').type('bdbaruah');
    cy.get('#signup-password > .native-input').type('bdb');
    cy.get('#signup-button').should('have.class', 'button-disabled');
    cy.get('#signup-logo').click(); // simulating clicking outside the form
    cy.get('ion-item.error-message').should(($items) => {
      expect($items).to.have.length(2);
    });
  });

  it('should successfully signup a user', () => {
    cy.logout();
    cy.get('#signup-email > .native-input').type(environment.testUser.email);
    cy.get('#signup-password > .native-input').type(environment.testUser.pwd);
    cy.get('#signup-button').click();
    cy.location('pathname', { timeout: 35000 }).should('include', 'home');
    cy.get('#signup-button').should('not.be.visible');
    cy.removeTestUser();
  });

  xit('should return to home page', () => {
    cy.get('#home-button').should('be.visible');
    cy.get('#home-button')
      .should('be.visible')
      .invoke('width')
      .should('be.greaterThan', 0);
    cy.waitUntilSettled();
    cy.get('#home-button')
      .should('be.visible')
      .click('center', { force: true });
    cy.location('pathname', { timeout: 25000 }).should('include', 'home');
  });
});
