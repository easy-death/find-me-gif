/// <reference types="cypress" />
Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('handle window resize', () => {
  it('changes columns count', () => {
    cy.visit('localhost:3000');
    cy.get('input').first().focus().type('hi');
    cy.get('.MuiMasonry-root', {timeout: 10000}).should('be.visible');
    cy.viewport(300, 600);
    cy.wait(500);
    cy.viewport(600, 600);
    cy.wait(500);
    cy.viewport(1200, 800);
    cy.wait(500);
    cy.viewport(2000, 1400);
  })
})