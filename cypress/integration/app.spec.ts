it('loads examples', () => {
  // const baseUrl: string = "http://localhost:4200";
  cy.visit('/');
  cy.get('ion-menu').should(($menu) => {
    expect($menu).to.have.length(1);
  });
  cy.get('ion-item.ion-activatable').should(($item) => {
    expect($item).to.have.length(6);
  });
});
