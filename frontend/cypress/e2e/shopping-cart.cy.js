/**
 * Test Suite: Shopping Cart Management
 * 
 * This suite tests all shopping cart functionality including
 * adding products, updating quantities, removing items, and
 * cart badge updates.
 */

describe('Shopping Cart Management', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearCart();
  });

  context('Adding Products to Cart', () => {
    it('TC2: Should add a single product to cart and update badge', () => {
      // Verify cart is empty initially
      cy.verifyCartBadge(0);

      // Add Codemify Backpack to cart
      cy.addProductToCart(1);

      // Verify cart badge updates to 1
      cy.verifyCartBadge(1);

      // Verify button shows active state
      cy.get('[data-testid="add-to-cart-1"]').should('have.class', 'active');
    });

    it('TC3: Should add multiple products to cart and update badge correctly', () => {
      // Add first product (Backpack)
      cy.addProductToCart(1);
      cy.verifyCartBadge(1);

      // Add second product (Bike Light)
      cy.addProductToCart(2);
      cy.verifyCartBadge(2);

      // Add third product (T-Shirt)
      cy.addProductToCart(3);
      cy.verifyCartBadge(3);

      // Verify all buttons show active state
      cy.get('[data-testid="add-to-cart-1"]').should('have.class', 'active');
      cy.get('[data-testid="add-to-cart-2"]').should('have.class', 'active');
      cy.get('[data-testid="add-to-cart-3"]').should('have.class', 'active');
    });
  });

  context('Viewing Cart', () => {
    it('TC4: Should display cart with all added items and correct information', () => {
      // Add three products to cart
      cy.addProductToCart(1); // Backpack $29.99
      cy.addProductToCart(2); // Bike Light $9.99
      cy.addProductToCart(3); // T-Shirt $15.99

      // Navigate to cart
      cy.goToCart();

      // Verify cart heading
      cy.contains('h2', 'Your Shopping Cart').should('be.visible');

      // Verify Cart button is active
      cy.contains('button', 'Cart').should('have.class', 'active');

      // Verify all 3 items are displayed
      cy.get('[data-testid^="cart-item-"]').should('have.length', 3);

      // Verify each cart item has required elements
      cy.get('[data-testid^="cart-item-"]').each(($item) => {
        cy.wrap($item).within(() => {
          // Product image
          cy.get('img').should('be.visible');
          
          // Product name
          cy.get('h3').should('be.visible');
          
          // Product description
          cy.get('p').should('be.visible');
          
          // Quantity controls
          cy.get('[data-testid^="decrease-quantity-"]').should('be.visible');
          cy.get('button').contains('+').should('be.visible');
          cy.get('button').contains('−').should('be.visible');
          
          // Remove button
          cy.get('[data-testid^="remove-from-cart-"]').should('be.visible');
        });
      });

      // Verify specific products and prices
      cy.contains('h3', 'Codemify Backpack').should('be.visible');
      cy.contains('$29.99 × 1 = $29.99').should('be.visible');

      cy.contains('h3', 'Codemify Bike Light').should('be.visible');
      cy.contains('$9.99 × 1 = $9.99').should('be.visible');

      cy.contains('h3', 'Codemify Bolt T-Shirt').should('be.visible');
      cy.contains('$15.99 × 1 = $15.99').should('be.visible');

      // Verify total
      cy.contains('Total:').should('be.visible');
      cy.contains('$55.97').should('be.visible');

      // Verify action buttons
      cy.contains('button', 'Continue Shopping').should('be.visible');
      cy.contains('button', 'Proceed to Checkout').should('be.visible');
    });
  });

  context('Updating Quantities', () => {
    it('TC5: Should increase product quantity and update totals correctly', () => {
      // Add Backpack to cart
      cy.addProductToCart(1);
      cy.goToCart();

      // Verify initial state
      cy.contains('$29.99 × 1 = $29.99').should('be.visible');
      cy.contains('$29.99').should('be.visible');
      cy.verifyCartBadge(1);

      // Increase quantity
      cy.get('[data-testid="increase-quantity-1"]').click();

      // Verify quantity updated to 2
      cy.contains('$29.99 × 2 = $59.98').should('be.visible');
      
      // Verify total updated
      cy.contains('$59.98').should('be.visible');
      
      // Verify cart badge updated to 2
      cy.verifyCartBadge(2);
    });

    it('TC6: Should auto-remove product when quantity decreased from 1', () => {
      // Add Backpack and Bike Light
      cy.addProductToCart(1);
      cy.addProductToCart(2);
      cy.goToCart();

      // Verify initial state - 2 items
      cy.get('[data-testid^="cart-item-"]').should('have.length', 2);
      cy.verifyCartBadge(2);

      // Decrease Bike Light quantity from 1
      cy.get('[data-testid="decrease-quantity-2"]').click();

      // Verify Bike Light removed
      cy.contains('h3', 'Codemify Bike Light').should('not.exist');
      
      // Verify only 1 item remains
      cy.get('[data-testid^="cart-item-"]').should('have.length', 1);
      
      // Verify cart badge updated
      cy.verifyCartBadge(1);
      
      // Verify total updated (only Backpack remains)
      cy.contains('$29.99').should('be.visible');
    });
  });

  context('Removing Items', () => {
    it('TC7: Should remove product from cart using Remove button', () => {
      // Add multiple products
      cy.addProductToCart(1); // Backpack
      cy.addProductToCart(3); // T-Shirt
      cy.goToCart();

      // Verify initial state
      cy.get('[data-testid^="cart-item-"]').should('have.length', 2);
      cy.verifyCartBadge(2);

      // Remove T-Shirt
      cy.get('[data-testid="remove-from-cart-3"]').click();

      // Verify T-Shirt removed
      cy.contains('h3', 'Codemify Bolt T-Shirt').should('not.exist');
      
      // Verify only 1 item remains
      cy.get('[data-testid^="cart-item-"]').should('have.length', 1);
      
      // Verify cart badge updated
      cy.verifyCartBadge(1);
      
      // Verify total updated (only Backpack)
      cy.contains('$29.99').should('be.visible');
    });
  });

  context('Cart Badge Persistence', () => {
    it('TC15: Should maintain cart badge count across navigation', () => {
      // Add 1 Backpack
      cy.addProductToCart(1);
      cy.verifyCartBadge(1);

      // Navigate to cart and increase quantity
      cy.goToCart();
      cy.get('[data-testid="increase-quantity-1"]').click();
      cy.verifyCartBadge(2);

      // Return to products
      cy.goToProducts();
      cy.verifyCartBadge(2);

      // Add Bike Light
      cy.addProductToCart(2);
      cy.verifyCartBadge(3);

      // Navigate to cart
      cy.goToCart();
      cy.verifyCartBadge(3);

      // Remove Bike Light
      cy.get('[data-testid="remove-from-cart-2"]').click();
      cy.verifyCartBadge(2);

      // Verify badge persists on return to products
      cy.goToProducts();
      cy.verifyCartBadge(2);
    });
  });

  context('Empty Cart State', () => {
    it('Should handle empty cart gracefully', () => {
      // Go to cart when empty
      cy.goToCart();

      // Should show appropriate message or empty state
      // (Implementation may vary - adjust based on actual UI)
      cy.contains('Your Shopping Cart').should('be.visible');
    });
  });
});
