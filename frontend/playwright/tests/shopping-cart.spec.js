/**
 * Test Suite: Shopping Cart Management
 * 
 * This suite tests all shopping cart functionality including
 * adding products, updating quantities, removing items, and
 * cart badge updates.
 * 
 * Migrated from Cypress to Playwright
 */

import { test, expect } from '@playwright/test';
import {
  clearCart,
  addProductToCart,
  verifyCartBadge,
  goToCart,
  goToProducts,
} from '../helpers/helpers.js';

test.describe('Shopping Cart Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearCart(page);
  });

  test.describe('Adding Products to Cart', () => {
    test('TC2: Should add a single product to cart and update badge', async ({ page }) => {
      // Verify cart is empty initially
      await verifyCartBadge(page, 0);

      // Add Codemify Backpack to cart
      await addProductToCart(page, 1);

      // Verify cart badge updates to 1
      await verifyCartBadge(page, 1);
    });

    test('TC3: Should add multiple products to cart and update badge correctly', async ({ page }) => {
      // Add first product (Backpack)
      await addProductToCart(page, 1);
      await verifyCartBadge(page, 1);

      // Add second product (Bike Light)
      await addProductToCart(page, 2);
      await verifyCartBadge(page, 2);

      // Add third product (T-Shirt)
      await addProductToCart(page, 3);
      await verifyCartBadge(page, 3);
    });
  });

  test.describe('Viewing Cart', () => {
    test('TC4: Should display cart with all added items and correct information', async ({ page }) => {
      // Add three products to cart
      await addProductToCart(page, 1); // Backpack $29.99
      await addProductToCart(page, 2); // Bike Light $9.99
      await addProductToCart(page, 3); // T-Shirt $15.99

      // Navigate to cart
      await goToCart(page);

      // Verify cart heading
      await expect(page.getByRole('heading', { name: 'Your Shopping Cart' })).toBeVisible();

      // Verify Cart button is active
      await expect(page.locator('button.nav-link', { hasText: 'Cart' })).toHaveClass(/.*active.*/);

      // Verify all 3 items are displayed
      const cartItems = page.locator('.cart-item');
      await expect(cartItems).toHaveCount(3);

      // Verify each cart item has required elements
      for (let i = 0; i < 3; i++) {
        const item = cartItems.nth(i);
        
        // Product image
        await expect(item.locator('img')).toBeVisible();
        
        // Product name
        await expect(item.locator('h3')).toBeVisible();
        
        // Product description
        await expect(item.locator('p')).toBeVisible();
        
        // Quantity controls
        await expect(item.getByTestId(/decrease-quantity-/)).toBeVisible();
        await expect(item.getByRole('button', { name: '+' })).toBeVisible();
        await expect(item.getByRole('button', { name: '−' })).toBeVisible();
        
        // Remove button
        await expect(item.getByTestId(/remove-from-cart-/)).toBeVisible();
      }

      // Verify specific products and prices
      await expect(page.getByRole('heading', { name: 'Codemify Backpack' })).toBeVisible();
      await expect(page.getByText('$29.99 × 1 = $29.99')).toBeVisible();

      await expect(page.getByRole('heading', { name: 'Codemify Bike Light' })).toBeVisible();
      await expect(page.getByText('$9.99 × 1 = $9.99')).toBeVisible();

      await expect(page.getByRole('heading', { name: 'Codemify Bolt T-Shirt' })).toBeVisible();
      await expect(page.getByText('$15.99 × 1 = $15.99')).toBeVisible();

      // Verify total
      await expect(page.getByText('Total:')).toBeVisible();
      await expect(page.getByText('$55.97')).toBeVisible();

      // Verify action buttons
      await expect(page.getByRole('button', { name: 'Continue Shopping' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Proceed to Checkout' })).toBeVisible();
    });
  });

  test.describe('Updating Quantities', () => {
    test('TC5: Should increase product quantity and update totals correctly', async ({ page }) => {
      // Add Backpack to cart
      await addProductToCart(page, 1);
      await goToCart(page);

      // Verify initial state
      await expect(page.getByText('$29.99 × 1 = $29.99')).toBeVisible();
      await expect(page.locator('.cart-total').getByText('$29.99')).toBeVisible();
      await verifyCartBadge(page, 1);

      // Increase quantity
      await page.getByTestId('increase-quantity-1').click();

      // Verify quantity updated to 2
      await expect(page.getByText('$29.99 × 2 = $59.98')).toBeVisible();
      
      // Verify total updated
      await expect(page.locator('.cart-total').getByText('$59.98')).toBeVisible();
      
      // Verify cart badge updated to 2
      await verifyCartBadge(page, 2);
    });

    test('TC6: Should auto-remove product when quantity decreased from 1', async ({ page }) => {
      // Add Backpack and Bike Light
      await addProductToCart(page, 1);
      await addProductToCart(page, 2);
      await goToCart(page);

      // Verify initial state - 2 items
      await expect(page.locator('.cart-item')).toHaveCount(2);
      await verifyCartBadge(page, 2);

      // Decrease Bike Light quantity from 1
      await page.getByTestId('decrease-quantity-2').click();

      // Verify Bike Light removed
      await expect(page.getByRole('heading', { name: 'Codemify Bike Light' })).not.toBeVisible();
      
      // Verify only 1 item remains
      await expect(page.locator('.cart-item')).toHaveCount(1);
      
      // Verify cart badge updated
      await verifyCartBadge(page, 1);
      
      // Verify total updated (only Backpack remains)
      await expect(page.locator('.cart-total').getByText('$29.99')).toBeVisible();
    });
  });

  test.describe('Removing Items', () => {
    test('TC7: Should remove product from cart using Remove button', async ({ page }) => {
      // Add multiple products
      await addProductToCart(page, 1); // Backpack
      await addProductToCart(page, 3); // T-Shirt
      await goToCart(page);

      // Verify initial state
      await expect(page.locator('.cart-item')).toHaveCount(2);
      await verifyCartBadge(page, 2);

      // Remove T-Shirt
      await page.getByTestId('remove-from-cart-3').click();

      // Verify T-Shirt removed
      await expect(page.getByRole('heading', { name: 'Codemify Bolt T-Shirt' })).not.toBeVisible();
      
      // Verify only 1 item remains
      await expect(page.locator('.cart-item')).toHaveCount(1);
      
      // Verify cart badge updated
      await verifyCartBadge(page, 1);
      
      // Verify total updated (only Backpack)
      await expect(page.locator('.cart-total').getByText('$29.99')).toBeVisible();
    });
  });

  test.describe('Cart Badge Persistence', () => {
    test('TC15: Should maintain cart badge count across navigation', async ({ page }) => {
      // Add 1 Backpack
      await addProductToCart(page, 1);
      await verifyCartBadge(page, 1);

      // Navigate to cart and increase quantity
      await goToCart(page);
      await page.getByTestId('increase-quantity-1').click();
      await verifyCartBadge(page, 2);

      // Return to products
      await goToProducts(page);
      await verifyCartBadge(page, 2);

      // Add Bike Light
      await addProductToCart(page, 2);
      await verifyCartBadge(page, 3);

      // Navigate to cart
      await goToCart(page);
      await verifyCartBadge(page, 3);

      // Remove Bike Light
      await page.getByTestId('remove-from-cart-2').click();
      await verifyCartBadge(page, 2);

      // Verify badge persists on return to products
      await goToProducts(page);
      await verifyCartBadge(page, 2);
    });
  });

  test.describe('Empty Cart State', () => {
    test('Should handle empty cart gracefully', async ({ page }) => {
      // Go to cart when empty
      await goToCart(page);

      // Should show appropriate message or empty state
      await expect(page.getByText('Your cart is empty')).toBeVisible();
    });
  });
});
