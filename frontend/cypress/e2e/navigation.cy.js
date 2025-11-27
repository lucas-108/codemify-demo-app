/**
 * Test Suite: Navigation
 * 
 * This suite tests all navigation functionality including
 * navigation buttons, logo clicks, and active states.
 */

describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearCart();
  });

  context('Navigation Buttons', () => {
    it('TC14: Should navigate between Products and Cart views', () => {
      // Add item to make cart navigation meaningful
      cy.addProductToCart(1);

      // Click Products button (already on products)
      cy.goToProducts();
      
      // Verify Products view
      cy.contains('h2', 'Products').should('be.visible');
      cy.contains('button', 'Products').should('have.class', 'active');

      // Click Cart button
      cy.goToCart();
      
      // Verify Cart view
      cy.contains('h2', 'Your Shopping Cart').should('be.visible');
      cy.contains('button', 'Cart').should('have.class', 'active');

      // Verify cart contents persisted
      cy.get('.cart-item').should('exist');
      cy.verifyCartBadge(1);

      // Navigate back to Products
      cy.goToProducts();
      
      // Verify Products view
      cy.contains('h2', 'Products').should('be.visible');
      cy.contains('button', 'Products').should('have.class', 'active');

      // Verify cart badge still shows item
      cy.verifyCartBadge(1);
    });

    it('TC14.1: Should show correct active states', () => {
      // Products should be active initially
      cy.contains('button', 'Products').should('have.class', 'active');
      cy.contains('button', 'Cart').should('not.have.class', 'active');

      // Navigate to cart
      cy.goToCart();

      // Cart should be active
      cy.contains('button', 'Cart').should('have.class', 'active');
      cy.contains('button', 'Products').should('not.have.class', 'active');

      // Navigate back to products
      cy.goToProducts();

      // Products should be active again
      cy.contains('button', 'Products').should('have.class', 'active');
      cy.contains('button', 'Cart').should('not.have.class', 'active');
    });
  });

  context('Store Logo Navigation', () => {
    it('TC13: Should navigate to products when clicking store logo', () => {
      // Add item and go to cart
      cy.addProductToCart(1);
      cy.goToCart();
      cy.contains('h2', 'Your Shopping Cart').should('be.visible');

      // Click store logo
      cy.contains('h1', 'Codemify Store').click();

      // Verify navigated to products
      cy.contains('h2', 'Products').should('be.visible');

      // Verify cart badge persists
      cy.verifyCartBadge(1);
    });

    it('TC13.1: Should navigate to products from checkout page', () => {
      // Add item and go to checkout
      cy.addProductToCart(1);
      cy.goToCart();
      cy.get('[data-testid="checkout-button"]').click();
      cy.contains('h2', 'Checkout').should('be.visible');

      // Click store logo
      cy.contains('h1', 'Codemify Store').click();

      // Verify navigated to products
      cy.contains('h2', 'Products').should('be.visible');

      // Verify cart still has items
      cy.verifyCartBadge(1);
    });

    it('TC13.2: Should be clickable from any page', () => {
      // Test from products page
      cy.contains('h1', 'Codemify Store').click();
      cy.contains('h2', 'Products').should('be.visible');

      // Test from cart page
      cy.goToCart();
      cy.contains('h1', 'Codemify Store').should('have.css', 'cursor', 'pointer');
    });
  });

  context('Continue Shopping Button', () => {
    it('TC12: Should return to products from cart using Continue Shopping', () => {
      // Add items and go to cart
      cy.addProductToCart(1);
      cy.addProductToCart(2);
      cy.goToCart();

      // Verify in cart
      cy.contains('h2', 'Your Shopping Cart').should('be.visible');
      cy.verifyCartBadge(2);

      // Click Continue Shopping
      cy.contains('button', 'Continue Shopping').click();

      // Verify returned to products
      cy.contains('h2', 'Products').should('be.visible');
      cy.get('.product-card').should('have.length', 6);

      // Verify cart badge persists
      cy.verifyCartBadge(2);

      // Verify cart contents preserved
      cy.goToCart();
      cy.get('.cart-item').should('have.length', 2);
    });
  });

  context('Navigation State Persistence', () => {
    it('Should maintain cart state across all navigation', () => {
      // Add items
      cy.addProductToCart(1);
      cy.addProductToCart(3);
      cy.verifyCartBadge(2);

      // Navigate to cart
      cy.goToCart();
      cy.verifyCartBadge(2);
      cy.get('.cart-item').should('have.length', 2);

      // Update quantity in cart
      cy.get('[data-testid="increase-quantity-1"]').click();
      cy.verifyCartBadge(3);

      // Navigate to products
      cy.goToProducts();
      cy.verifyCartBadge(3);

      // Navigate back to cart
      cy.goToCart();
      cy.verifyCartBadge(3);
      cy.contains('$29.99 × 2').should('be.visible');

      // Click logo to go to products
      cy.contains('h1', 'Codemify Store').click();
      cy.verifyCartBadge(3);

      // Add another item
      cy.addProductToCart(5);
      cy.verifyCartBadge(4);

      // Verify cart has all items
      cy.goToCart();
      cy.get('.cart-item').should('have.length', 3);
    });

    it('Should clear navigation state after order completion', () => {
      // Add item and complete order
      cy.addProductToCart(1);
      cy.goToCart();
      cy.get('[data-testid="checkout-button"]').click();
      cy.fillCheckoutForm();
      cy.get('[data-testid="complete-order-button"]').click();

      // Wait for order confirmation
      cy.get('[data-testid="order-confirmation"]', { timeout: 15000 }).should('be.visible');
      cy.verifyCartBadge(0);

      // Continue shopping
      cy.get('[data-testid="continue-shopping-button"]', { timeout: 5000 }).click();
      cy.contains('h2', 'Products').should('be.visible');

      // Navigate to cart - should be empty
      cy.goToCart();
      cy.verifyCartBadge(0);
    });
  });

  context('URL and Routing', () => {
    it('Should maintain proper URL structure', () => {
      // Products page
      cy.url().should('include', '/demo-app');
      
      // Navigate through app
      cy.addProductToCart(1);
      cy.goToCart();
      cy.url().should('include', '/demo-app');
      
      cy.goToProducts();
      cy.url().should('include', '/demo-app');
    });
  });

  context('Accessibility - Keyboard Navigation', () => {
    it('Should support keyboard navigation for main elements', () => {
      // Focus on Products button and verify
      cy.contains('button', 'Products').should('be.visible').focus();
      cy.focused().should('contain', 'Products');

      // Focus on Cart button
      cy.contains('button', 'Cart').focus();
      cy.focused().should('contain', 'Cart');

      // Verify Cart button is clickable (simulate click for navigation test)
      cy.focused().click();
      cy.contains('h2', 'Your Shopping Cart').should('be.visible');
    });
  });
});
