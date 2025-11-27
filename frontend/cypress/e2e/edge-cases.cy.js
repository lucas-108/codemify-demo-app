/**
 * Test Suite: Edge Cases and Error Handling
 * 
 * This suite tests edge cases, boundary conditions, and
 * error handling scenarios.
 */

describe('Edge Cases and Error Handling', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearCart();
  });

  context('Cart Edge Cases', () => {
    it('Should handle maximum quantity increases gracefully', () => {
      // Add product and go to cart
      cy.addProductToCart(1);
      cy.goToCart();

      // Increase quantity multiple times
      for (let i = 0; i < 10; i++) {
        cy.get('[data-testid="increase-quantity-1"]').click();
      }

      // Verify quantity reached 11
      cy.contains('$29.99 × 11').should('be.visible');
      cy.verifyCartBadge(11);

      // Verify total calculated correctly
      const expectedTotal = (29.99 * 11).toFixed(2);
      cy.contains(`$${expectedTotal}`).should('be.visible');
    });

    it('Should handle rapid clicking of add to cart', () => {
      // Click add to cart multiple times rapidly
      for (let i = 0; i < 5; i++) {
        cy.addProductToCart(1);
      }

      // Badge should still show 1 (not add multiple times for same product)
      cy.verifyCartBadge(1);

      cy.goToCart();
      cy.get('[data-testid^="cart-item-"]').should('have.length', 1);
    });

    it('Should handle removing all items from cart', () => {
      // Add multiple items
      cy.addProductToCart(1);
      cy.addProductToCart(2);
      cy.addProductToCart(3);
      cy.goToCart();

      // Remove all items
      cy.get('[data-testid="remove-from-cart-1"]').click();
      cy.get('[data-testid="remove-from-cart-2"]').click();
      cy.get('[data-testid="remove-from-cart-3"]').click();

      // Verify cart is empty
      cy.verifyCartBadge(0);
      cy.get('[data-testid^="cart-item-"]').should('have.length', 0);
    });

    it('Should handle decreasing quantity to zero for all items', () => {
      // Add items with quantity 1
      cy.addProductToCart(1);
      cy.addProductToCart(2);
      cy.goToCart();

      // Decrease both to zero
      cy.get('[data-testid="decrease-quantity-1"]').click();
      cy.get('[data-testid="decrease-quantity-2"]').click();

      // Verify cart is empty
      cy.verifyCartBadge(0);
      cy.get('[data-testid^="cart-item-"]').should('have.length', 0);
    });
  });

  context('Price Calculation Edge Cases', () => {
    it('Should calculate total correctly with mixed quantities', () => {
      // Add products
      cy.addProductToCart(1); // $29.99
      cy.addProductToCart(2); // $9.99
      cy.addProductToCart(5); // $7.99
      cy.goToCart();

      // Set different quantities
      cy.get('[data-testid="increase-quantity-1"]').click(); // 2x
      cy.get('[data-testid="increase-quantity-1"]').click(); // 3x
      cy.get('[data-testid="increase-quantity-2"]').click(); // 2x

      // Calculate expected total: (29.99 * 3) + (9.99 * 2) + (7.99 * 1)
      const expected = (29.99 * 3 + 9.99 * 2 + 7.99 * 1).toFixed(2);
      
      cy.contains(`$${expected}`).should('be.visible');
    });

    it('Should handle decimal precision in calculations', () => {
      // Add Bike Light (9.99) multiple times
      cy.addProductToCart(2);
      cy.goToCart();

      // Increase to 3
      cy.get('[data-testid="increase-quantity-2"]').click();
      cy.get('[data-testid="increase-quantity-2"]').click();

      // 9.99 * 3 = 29.97
      cy.contains('$9.99 × 3 = $29.97').should('be.visible');
    });
  });

  context('Form Validation Edge Cases', () => {
    beforeEach(() => {
      cy.addProductToCart(1);
      cy.goToCart();
      cy.get('[data-testid="checkout-button"]').click();
    });

    it('Should handle special characters in name fields', () => {
      cy.fillCheckoutForm({
        firstName: "Jean-Pierre",
        lastName: "O'Connor"
      });

      cy.get('[data-testid="complete-order-button"]').click();
      cy.contains('Order Placed Successfully').should('be.visible');
    });

    it('Should validate zip code formats', () => {
      // Test with 5-digit zip
      cy.fillCheckoutForm({ zipCode: '12345' });
      cy.get('[data-testid="zip-code-input"]').should('have.value', '12345');

      // Clear and test with 9-digit zip
      cy.get('[data-testid="zip-code-input"]').clear().type('12345-6789');
      cy.get('[data-testid="zip-code-input"]').should('have.value', '12345-6789');
    });

    it('Should handle long addresses', () => {
      const longAddress = '1234 Very Long Street Name That Goes On And On Avenue Suite 100';
      cy.fillCheckoutForm({ address: longAddress });
      cy.get('[data-testid="address-input"]').should('have.value', longAddress);
    });

    it('Should validate card number length', () => {
      cy.fillCheckoutForm({ cardNumber: '4532015112830366' });
      cy.get('[data-testid="card-number-input"]').should('have.value', '4532015112830366');
    });

    it('Should handle various email formats', () => {
      const emails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user123@test-domain.com'
      ];

      emails.forEach((email) => {
        cy.get('[data-testid="email-input"]').clear().type(email);
        cy.get('[data-testid="email-input"]').should('have.value', email);
      });
    });
  });

  context('Navigation Edge Cases', () => {
    it('Should handle rapid navigation clicks', () => {
      // Rapidly click between Products and Cart
      cy.goToCart();
      cy.goToProducts();
      cy.goToCart();
      cy.goToProducts();

      // Should end up on Products
      cy.contains('h2', 'Products').should('be.visible');
    });

    it('Should maintain state when navigating during cart updates', () => {
      // Add item
      cy.addProductToCart(1);
      cy.goToCart();

      // Increase quantity
      cy.get('[data-testid="increase-quantity-1"]').click();

      // Immediately navigate away
      cy.goToProducts();

      // Navigate back
      cy.goToCart();

      // State should be preserved
      cy.contains('$29.99 × 2').should('be.visible');
    });
  });

  context('Browser State Persistence', () => {
    it('Should persist cart after page reload', () => {
      // Add items
      cy.addProductToCart(1);
      cy.addProductToCart(2);
      cy.verifyCartBadge(2);

      // Reload page
      cy.reload();

      // Verify cart persisted
      cy.verifyCartBadge(2);
      
      cy.goToCart();
      cy.get('[data-testid^="cart-item-"]').should('have.length', 2);
    });

    it('Should clear cart when localStorage is cleared', () => {
      // Add items
      cy.addProductToCart(1);
      cy.verifyCartBadge(1);

      // Clear localStorage and reload
      cy.clearCart();

      // Verify cart is empty
      cy.verifyCartBadge(0);
    });
  });

  context('UI Responsiveness', () => {
    it('Should handle viewport resize gracefully', () => {
      // Test mobile viewport
      cy.viewport(375, 667);
      cy.contains('h2', 'Products').should('be.visible');
      cy.get('[data-testid^="product-"]').should('have.length', 6);

      // Test tablet viewport
      cy.viewport(768, 1024);
      cy.contains('h2', 'Products').should('be.visible');

      // Test desktop viewport
      cy.viewport(1920, 1080);
      cy.contains('h2', 'Products').should('be.visible');
    });
  });

  context('Concurrent Actions', () => {
    it('Should handle adding multiple products quickly', () => {
      // Add all products rapidly
      for (let i = 1; i <= 6; i++) {
        cy.addProductToCart(i);
      }

      // Verify all products in cart
      cy.verifyCartBadge(6);
      
      cy.goToCart();
      cy.get('[data-testid^="cart-item-"]').should('have.length', 6);
    });

    it('Should handle quantity updates on multiple items', () => {
      // Add products
      cy.addProductToCart(1);
      cy.addProductToCart(2);
      cy.addProductToCart(3);
      cy.goToCart();

      // Update multiple quantities
      cy.get('[data-testid="increase-quantity-1"]').click();
      cy.get('[data-testid="increase-quantity-2"]').click();
      cy.get('[data-testid="increase-quantity-3"]').click();

      // Verify badge updated correctly
      cy.verifyCartBadge(6); // 2 + 2 + 2
    });
  });
});
