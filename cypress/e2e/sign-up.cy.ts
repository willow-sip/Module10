describe('end-to-end tests for sign-up page', () => {
  const email = "admin@gmail.com";
  const password = '123456789';

  beforeEach(() => {
    cy.visit('http://localhost:3000/sign-up', {
      onBeforeLoad(window) {
        Object.defineProperty(window.navigator, 'language', {
          value: 'en',
          configurable: true,
        });
        window.localStorage.setItem('i18nextLng', 'en');
      },
    });
  });

  it('shows sign-up form', () => {
    cy.contains('h2', 'Create an account').should('be.visible');
    cy.get('[data-testid="email"]').should('be.visible');
    cy.get('[data-testid="password"]').should('be.visible');
    cy.get('[data-testid="submit-button"]').should('contain.text', 'Sign Up');
  });

  it('shows notifications for empty fields', () => {
    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="notification"]').should('contain.text', 'Input email please');
    cy.get('[data-testid="notification"]').should('contain.text', 'Input password please');
  });

  it('shows notification for invalid data', () => {
    cy.get('[data-testid="email"]').type('invalid-email');
    cy.get('[data-testid="password"]').type(password);
    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="notification"]').should('contain.text', 'Invalid email or password');
  });

  it('shows notification for short password', () => {
    cy.get('[data-testid="email"]').type(email);
    cy.get('[data-testid="password"]').type('123');
    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="notification"]').should('contain.text', 'Your password must be longer than 6 symbols');
  })

  it('signs up with valid data', () => {
    cy.get('[data-testid="email"]').type(email);
    cy.get('[data-testid="password"]').type(password);
    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="notification"]').should('contain.text', 'Sign up successful, now sign in!');

    cy.url().should('include', '/sign-in');
  });

  it('switches to sign-in page by switch link', () => {
    cy.contains('span', 'Sign in').click();
    cy.url().should('include', '/sign-in');
  });
});