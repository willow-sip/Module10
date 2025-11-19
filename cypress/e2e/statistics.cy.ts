import { Like, Comment } from '../../src/data/datatypes';

describe('end-to-end tests for statistics page)', () => {

    //! run the application, sign in, copy the token and insert here !
    //run console.log(localStorage.authToken) in browser console

    const mockToken = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2MzU3Njc0NywiZXhwIjoxNzYzNTgzOTQ3fQ.gPs6xRfZ_0nGsLGxZS7uFv3wenFYnxfE0FUi_Uzi5js';

    beforeEach(() => {
        cy.visit('http://localhost:3000/statistics', {
            onBeforeLoad(window) {
                Object.defineProperty(window.navigator, 'language', {
                    value: 'en',
                    configurable: true,
                });
                window.localStorage.setItem('currentUser', JSON.stringify({id: 1, username: "helenahills"}));
                window.localStorage.setItem('authToken', mockToken);
                window.localStorage.setItem('expiresAt', (Date.now() + 1000 * 60 * 60).toString());
                window.localStorage.setItem('i18nextLng', 'en');
            },
        });
    });

    it('renders general stats at the top of the page', () => {
        cy.get('[data-testid="stat"]').should('have.length', 3);

        cy.contains('Total Views').should('exist');
        cy.contains('45678').should('exist');

        cy.contains('Total Likes').should('exist');
        cy.contains('2405').should('exist');

        cy.contains('Total Comments').should('exist');
        cy.contains('10353').should('exist');
    });

    it('renders table stats when first loaded', () => {
        cy.get('[data-testid="table-stats"]').should('exist');
        cy.get('[data-testid="chart-stats"]').should('not.exist');
    });

    it('switches between table and chart stats', () => {
        cy.get('[data-testid="view-toggle"]').siblings('.slider').click();
        cy.get('[data-testid="chart-stats"]').should('exist');
        cy.get('[data-testid="table-stats"]').should('not.exist');

        cy.get('[data-testid="view-toggle"]').siblings('.slider').click();
        cy.get('[data-testid="table-stats"]').should('exist');
        cy.get('[data-testid="chart-stats"]').should('not.exist');
    });

    it('switches to profile page', () => {
        cy.get('[data-testid="profile-link"]').click();
        cy.url().should('include', '/profile');
    });
});
