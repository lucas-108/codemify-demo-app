/**
 * Test Suite: Product Catalog Display
 * 
 * This suite tests the product catalog functionality including
 * product display, layout, and information accuracy.
 */

describe('Product Catalog Display', () => {
  beforeEach(() => {
    // Visit the application before each test
    cy.visit('/');
    cy.clearCart();
  });

  it('TC1: Should display product catalog with all product information', () => {
    // Verify page heading
    cy.contains('h2', 'Products').should('be.visible');
    cy.contains('6 items').should('be.visible');

    // Verify all 6 products are displayed
    cy.get('.product-card').should('have.length', 6);

    // Verify each product has required elements
    cy.get('.product-card').each(($product) => {
      cy.wrap($product).within(() => {
        // Product image or fallback
        cy.get('img, .image-fallback').should('exist');
        
        // Product name (h3)
        cy.get('h3.product-name').should('be.visible');
        
        // Product description (p)
        cy.get('p.product-description').should('be.visible');
        
        // Product price
        cy.get('.product-price').should('be.visible');
        
        // Add to Cart button
        cy.get('button').contains('Add to Cart').should('be.visible');
      });
    });

    // Verify specific products with correct prices
    const expectedProducts = [
      { name: 'Codemify Backpack', price: '$29.99' },
      { name: 'Codemify Bike Light', price: '$9.99' },
      { name: 'Codemify Bolt T-Shirt', price: '$15.99' },
      { name: 'Codemify Fleece Jacket', price: '$49.99' },
      { name: 'Codemify Onesie', price: '$7.99' },
      { name: 'Test.allTheThings() T-Shirt (Red)', price: '$15.99' }
    ];

    expectedProducts.forEach((product) => {
      cy.contains('h3', product.name).should('be.visible');
      cy.contains(product.price).should('be.visible');
    });
  });

  it('TC1.1: Should display product images correctly', () => {
    // Verify all product images or fallbacks are present
    cy.get('.product-card').each(($card) => {
      cy.wrap($card).within(() => {
        // Each product should have either an image or fallback
        cy.get('img.product-image').should('exist').and('have.attr', 'src').and('not.be.empty');
        cy.get('img.product-image').should('have.attr', 'alt').and('not.be.empty');
      });
    });
  });

  it('TC1.2: Should display navigation elements', () => {
    // Verify header/logo
    cy.contains('Codemify Store').should('be.visible');

    // Verify navigation buttons
    cy.contains('button', 'Products').should('be.visible');
    cy.contains('button', 'Cart').should('be.visible');

    // Verify footer
    cy.contains('© 2025 Codemify Store').should('be.visible');
  });
});
