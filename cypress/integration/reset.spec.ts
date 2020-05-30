import { environment } from '../../src/environments/environment.test';

describe('Reset page', () => {
  beforeEach(() => {
    cy.visit('/registration/reset');
    cy.get('#splash-screen').should('not.be.visible');
  });

  it('should show password reset request form', () => {
    cy.get('#reqPasswordResetForm').should('be.visible');
  });

  context('Request password reset', () => {
    context('When logged out', () => {
      beforeEach(() => {
        cy.logout();
      });

      it('should not permit requesting change in password with faulty email', () => {
        cy.get('#reqResetPassword-email > .native-input').type('bdb');
        cy.get('#reset-logo').click(); // simulating clicking outside the form
        cy.get('#reqResetPassword-submit-button').should(
          'have.class',
          'button-disabled'
        );
        cy.get('ion-item.error-message').should(($items) => {
          expect($items).to.have.length(1);
        });
      });

      it('should permit a successful reset of password', () => {
        cy.get('#reqResetPassword-email > .native-input').type(
          'bdb.login@getbinder.net'
        );
        cy.get('#reqResetPassword-submit-button')
          .should('not.have.class', 'button-disabled')
          .click();
      });
    });

    context('When logged in', () => {
      before(() => {
        cy.logout();
        cy.visit('/home');
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
      });

      after(() => {
        cy.logout();
      });

      it('should not allow to change email', () => {
        cy.get('#reqResetPassword-email-logged')
          .invoke('val')
          .should('contain', 'bdb.login@getbinder.net');
        cy.get('#reqResetPassword-email-logged')
          .type('bdb')
          .should('not.be.true');
      });
    });
  });

  context('Reset password', () => {
    context('When logged out', () => {
      beforeEach(() => {
        cy.logout();
        cy.visit(
          '/registration/reset?mode=resetPassword&oobcode=abc123&apiKey=12323kjkg&lang=en'
        );
      });

      it('should display the reset password form', () => {
        cy.get('ion-list-header > ion-label').should(
          'have.text',
          'Reset password form'
        );
      });
    });
  });
});
