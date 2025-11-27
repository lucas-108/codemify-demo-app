/**
 * Test Suite: Checkout Process
 * 
 * This suite tests the complete checkout workflow including
 * navigation, form validation, and order completion.
 */

describe('Checkout Process', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearCart();
  });

  context('Checkout Navigation', () => {
    it('TC8: Should navigate to checkout page with correct order summary', () => {
      // Add 2 Backpacks to cart
      cy.addProductToCart(1);
      cy.goToCart();
      cy.get('[data-testid="increase-quantity-1"]').click();

      // Proceed to checkout
      cy.get('[data-testid="checkout-button"]').click();

      // Verify checkout page loaded
      cy.contains('h2', 'Checkout').should('be.visible');

      // Verify Order Summary
      cy.contains('h3', 'Order Summary').should('be.visible');
      cy.contains('Codemify Backpack × 2').should('be.visible');
      cy.contains('$59.98').should('be.visible');
      cy.contains('Total:').should('be.visible');

      // Verify Shipping Information form
      cy.contains('h3', 'Shipping Information').should('be.visible');
      cy.get('[data-testid="first-name-input"]').should('be.visible');
      cy.get('[data-testid="last-name-input"]').should('be.visible');
      cy.get('[data-testid="email-input"]').should('be.visible');
      cy.get('[data-testid="address-input"]').should('be.visible');
      cy.get('[data-testid="city-input"]').should('be.visible');
      cy.get('[data-testid="state-input"]').should('be.visible');
      cy.get('[data-testid="zip-code-input"]').should('be.visible');

      // Verify Payment Information form
      cy.contains('h3', 'Payment Information').should('be.visible');
      cy.get('[data-testid="card-number-input"]').should('be.visible');
      cy.get('[data-testid="expiry-date-input"]').should('be.visible');
      cy.get('[data-testid="cvv-input"]').should('be.visible');

      // Verify action buttons
      cy.get('[data-testid="cancel-button"]').should('be.visible');
      cy.get('[data-testid="complete-order-button"]').should('be.visible');
    });

    it('TC11: Should cancel checkout and return to cart', () => {
      // Add product and go to checkout
      cy.addProductToCart(1);
      cy.goToCart();
      cy.get('[data-testid="checkout-button"]').click();

      // Verify on checkout page
      cy.contains('h2', 'Checkout').should('be.visible');

      // Click cancel
      cy.get('[data-testid="cancel-button"]').click();

      // Verify returned to cart
      cy.contains('h2', 'Your Shopping Cart').should('be.visible');

      // Verify cart still has items
      cy.get('[data-testid="cart-item-1"]').should('exist');
      cy.verifyCartBadge(1);
    });
  });

  context('Form Validation', () => {
    beforeEach(() => {
      // Setup: Add product and navigate to checkout
      cy.addProductToCart(5); // Onesie $7.99
      cy.goToCart();
      cy.get('[data-testid="checkout-button"]').click();
    });

    it('TC10: Should prevent submission with empty required fields', () => {
      // Try to submit without filling any fields
      cy.get('[data-testid="complete-order-button"]').click();

      // Should remain on checkout page
      cy.contains('h2', 'Checkout').should('be.visible');

      // First name field should be focused (HTML5 validation)
      cy.get('[data-testid="first-name-input"]').should('have.focus');
    });

    it('TC10.1: Should validate email format', () => {
      // Fill all fields except email with invalid format
      cy.fillCheckoutForm({ email: 'invalid-email' });

      // Try to submit
      cy.get('[data-testid="complete-order-button"]').click();

      // Should remain on checkout page
      cy.contains('h2', 'Checkout').should('be.visible');
    });

    it('TC10.2: Should validate all required fields individually', () => {
      const requiredFields = [
        { testId: 'first-name-input', value: 'John' },
        { testId: 'last-name-input', value: 'Doe' },
        { testId: 'email-input', value: 'john@example.com' },
        { testId: 'address-input', value: '123 Main St' },
        { testId: 'city-input', value: 'San Francisco' },
        { testId: 'state-input', value: 'CA' },
        { testId: 'zip-code-input', value: '94102' },
        { testId: 'card-number-input', value: '4532015112830366' },
        { testId: 'expiry-date-input', value: '12/25' },
        { testId: 'cvv-input', value: '123' }
      ];

      requiredFields.forEach((field) => {
        cy.get(`[data-testid="${field.testId}"]`)
          .should('be.visible')
          .and('have.attr', 'required');
      });
    });
  });

  context('Order Completion', () => {
    it('TC9: Should complete checkout with valid data and clear cart', () => {
      // Add product to cart
      cy.addProductToCart(1); // Backpack
      cy.goToCart();
      cy.get('[data-testid="increase-quantity-1"]').click();
      
      // Verify total before checkout
      cy.contains('$59.98').should('be.visible');
      cy.verifyCartBadge(2);

      // Proceed to checkout
      cy.get('[data-testid="checkout-button"]').click();

      // Fill form with valid data
      cy.fillCheckoutForm();

      // Submit order
      cy.get('[data-testid="complete-order-button"]').click();

      // Verify order confirmation
      cy.contains('Order Placed Successfully').should('be.visible');
      cy.contains('Thank you for your purchase').should('be.visible');
      cy.contains('$59.98').should('be.visible');

      // Verify Continue Shopping button
      cy.contains('button', 'Continue Shopping').should('be.visible');

      // Verify cart is cleared
      cy.verifyCartBadge(0);

      // Click Continue Shopping
      cy.contains('button', 'Continue Shopping').click();

      // Verify returned to products page
      cy.contains('h2', 'Products').should('be.visible');
      
      // Verify cart still empty
      cy.verifyCartBadge(0);
    });

    it('TC9.1: Should complete checkout with different products', () => {
      // Add multiple products
      cy.addProductToCart(2); // Bike Light $9.99
      cy.addProductToCart(5); // Onesie $7.99
      cy.goToCart();

      const expectedTotal = '$17.98';
      cy.contains(expectedTotal).should('be.visible');

      // Proceed to checkout
      cy.get('[data-testid="checkout-button"]').click();

      // Verify order summary
      cy.contains('Codemify Bike Light × 1').should('be.visible');
      cy.contains('Codemify Onesie × 1').should('be.visible');

      // Fill and submit
      cy.fillCheckoutForm();
      cy.get('[data-testid="complete-order-button"]').click();

      // Verify confirmation with correct total
      cy.contains('Order Placed Successfully').should('be.visible');
      cy.contains(expectedTotal).should('be.visible');
    });

    it('TC9.2: Should handle single item checkout', () => {
      // Add single product
      cy.addProductToCart(3); // T-Shirt $15.99
      cy.goToCart();
      cy.get('[data-testid="checkout-button"]').click();

      // Fill and submit
      cy.fillCheckoutForm({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com'
      });
      
      cy.get('[data-testid="complete-order-button"]').click();

      // Verify success
      cy.contains('Order Placed Successfully').should('be.visible');
      cy.contains('$15.99').should('be.visible');
    });
  });

  context('Checkout Flow Integration', () => {
    it('Should complete full e2e workflow from browsing to order completion', () => {
      // Browse products
      cy.contains('h2', 'Products').should('be.visible');
      cy.get('[data-testid^="product-"]').should('have.length', 6);

      // Add products to cart
      cy.addProductToCart(1); // Backpack $29.99
      cy.addProductToCart(4); // Fleece Jacket $49.99
      cy.verifyCartBadge(2);

      // View cart
      cy.goToCart();
      cy.contains('h2', 'Your Shopping Cart').should('be.visible');
      cy.contains('$79.98').should('be.visible');

      // Update quantity
      cy.get('[data-testid="increase-quantity-1"]').click();
      cy.contains('$109.97').should('be.visible');
      cy.verifyCartBadge(3);

      // Proceed to checkout
      cy.get('[data-testid="checkout-button"]').click();
      cy.contains('h2', 'Checkout').should('be.visible');

      // Complete checkout
      cy.fillCheckoutForm();
      cy.get('[data-testid="complete-order-button"]').click();

      // Verify success
      cy.contains('Order Placed Successfully').should('be.visible');
      cy.verifyCartBadge(0);

      // Return to shopping
      cy.contains('button', 'Continue Shopping').click();
      cy.contains('h2', 'Products').should('be.visible');
    });
  });
});
