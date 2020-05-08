it('loads examples', () => {
  // const baseUrl: string = "http://localhost:4200";
  cy.visit('/');
  cy.get('ion-menu').should(($menu) => {
    expect($menu).to.have.length(1);
  });
});
