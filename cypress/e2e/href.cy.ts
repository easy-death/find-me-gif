/// <reference types="cypress" />
Cypress.on('uncaught:exception', (err, runnable) => {
    return false
  })
  
describe('url changes', () => {
    beforeEach(() => {
        cy.visit('localhost:3000')
        cy.get('input').first().type('hi')
        cy.wait(1000)
    })
    it('changes url on input', () => {
        cy.location('search').should('eq', '?query=hi')
        cy.get('*[aria-label~="pagination"]').find(' *[aria-label~="page"]').last().click()
        cy.wait(1000)
        cy.location('search').should('eq', '?query=hi&page=2');
    })

    it('loads gifs from url', () => {
        cy.reload()
        cy.get('input').first().should('contain.value', 'hi')
        cy.get('.giphy-gif').should('have.length.at.least', 1)
    })

    it('handles navigation', () => {
        cy.get('*[aria-label~="pagination"]').find(' *[aria-label~="page"]').last().click();
        cy.wait(1000);
        cy.go('back');
        cy.wait(500);
        cy.get('*[aria-label~="pagination"]').find(' *[aria-label="page 1"]').first().should('have.class', 'Mui-selected')
    })
})