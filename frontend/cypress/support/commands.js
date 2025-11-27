// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * Custom command to clear cart by reloading the page
 * Since cart is stored in localStorage, this ensures a clean state
 */
Cypress.Commands.add('clearCart', () => {
  cy.window().then((win) => {
    win.localStorage.clear();
  });
  cy.reload();
});

/**
 * Custom command to add a product to cart by product ID
 * @param {number} productId - The ID of the product to add
 */
Cypress.Commands.add('addProductToCart', (productId) => {
  cy.get(`[data-testid="add-to-cart-${productId}"]`).click();
});

/**
 * Custom command to verify cart badge count
 * @param {number} count - Expected count in the cart badge
 */
Cypress.Commands.add('verifyCartBadge', (count) => {
  if (count === 0) {
    cy.contains('button', 'Cart').within(() => {
      cy.get('.cart-badge').should('not.exist');
    });
  } else {
    cy.contains('button', 'Cart').within(() => {
      cy.get('.cart-badge').should('be.visible').and('contain', count);
    });
  }
});

/**
 * Custom command to navigate to cart
 */
Cypress.Commands.add('goToCart', () => {
  cy.contains('button', 'Cart').click();
});

/**
 * Custom command to navigate to products
 */
Cypress.Commands.add('goToProducts', () => {
  cy.contains('button', 'Products').click();
});

/**
 * Custom command to fill checkout form
 * @param {object} formData - Object containing form field values
 */
Cypress.Commands.add('fillCheckoutForm', (formData = {}) => {
  const defaultData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    address: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    cardNumber: '4532015112830366',
    expiryDate: '12/25',
    cvv: '123',
    ...formData
  };

  cy.get('[data-testid="first-name-input"]').clear().type(defaultData.firstName);
  cy.get('[data-testid="last-name-input"]').clear().type(defaultData.lastName);
  cy.get('[data-testid="email-input"]').clear().type(defaultData.email);
  cy.get('[data-testid="address-input"]').clear().type(defaultData.address);
  cy.get('[data-testid="city-input"]').clear().type(defaultData.city);
  cy.get('[data-testid="state-input"]').clear().type(defaultData.state);
  cy.get('[data-testid="zip-code-input"]').clear().type(defaultData.zipCode);
  cy.get('[data-testid="card-number-input"]').clear().type(defaultData.cardNumber);
  cy.get('[data-testid="expiry-date-input"]').clear().type(defaultData.expiryDate);
  cy.get('[data-testid="cvv-input"]').clear().type(defaultData.cvv);
});
