describe('Binder app', () => {
  /* it('should navigate to registration page the first time', () => {
    indexedDB.deleteDatabase('__binder');
    cy.visit('/home');
    cy.location('pathname', { timeout: 10000 }).should('include', 'registration');
  }); */

  it('should have a menu', () => {
    cy.visit('/');
    cy.get('ion-menu').should(($menu) => {
      expect($menu).to.have.length(1);
    });
    cy.get('ion-item.ion-activatable').should(($item) => {
      expect($item).to.have.length(2);
    });
  });
});
