/**
 * Test Suite: Checkout Process
 * 
 * This suite tests the complete checkout workflow including
 * navigation, form validation, and order completion.
 * 
 * Migrated from Cypress to Playwright
 */

import { test, expect } from '@playwright/test';
import {
  clearCart,
  addProductToCart,
  verifyCartBadge,
  goToCart,
  fillCheckoutForm,
} from '../helpers/helpers.js';

test.describe('Checkout Process', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearCart(page);
  });

  test.describe('Checkout Navigation', () => {
    test('TC8: Should navigate to checkout page with correct order summary', async ({ page }) => {
      // Add 2 Backpacks to cart
      await addProductToCart(page, 1);
      await goToCart(page);
      await page.getByTestId('increase-quantity-1').click();

      // Proceed to checkout
      await page.getByTestId('checkout-button').click();

      // Verify checkout page loaded
      await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();

      // Verify Order Summary
      await expect(page.getByRole('heading', { name: 'Order Summary' })).toBeVisible();
      await expect(page.getByText('Codemify Backpack × 2')).toBeVisible();
      await expect(page.locator('.summary-total').getByText('$59.98')).toBeVisible();
      await expect(page.getByText('Total:')).toBeVisible();

      // Verify Shipping Information form
      await expect(page.getByRole('heading', { name: 'Shipping Information' })).toBeVisible();
      await expect(page.getByTestId('first-name-input')).toBeVisible();
      await expect(page.getByTestId('last-name-input')).toBeVisible();
      await expect(page.getByTestId('email-input')).toBeVisible();
      await expect(page.getByTestId('address-input')).toBeVisible();
      await expect(page.getByTestId('city-input')).toBeVisible();
      await expect(page.getByTestId('state-input')).toBeVisible();
      await expect(page.getByTestId('zip-code-input')).toBeVisible();

      // Verify Payment Information form
      await expect(page.getByRole('heading', { name: 'Payment Information' })).toBeVisible();
      await expect(page.getByTestId('card-number-input')).toBeVisible();
      await expect(page.getByTestId('expiry-date-input')).toBeVisible();
      await expect(page.getByTestId('cvv-input')).toBeVisible();

      // Verify action buttons
      await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
      await expect(page.getByTestId('complete-order-button')).toBeVisible();
    });

    test('TC11: Should cancel checkout and return to cart', async ({ page }) => {
      // Add product and go to checkout
      await addProductToCart(page, 1);
      await goToCart(page);
      await page.getByTestId('checkout-button').click();

      // Verify on checkout page
      await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();

      // Click cancel
      await page.getByRole('button', { name: 'Cancel' }).click();

      // Verify returned to cart
      await expect(page.getByRole('heading', { name: 'Your Shopping Cart' })).toBeVisible();

      // Verify cart still has items
      await expect(page.locator('.cart-item')).toBeVisible();
      await verifyCartBadge(page, 1);
    });
  });

  test.describe('Form Validation', () => {
    test.beforeEach(async ({ page }) => {
      // Setup: Add product and navigate to checkout
      await addProductToCart(page, 5); // Onesie $7.99
      await goToCart(page);
      await page.getByTestId('checkout-button').click();
    });

    test('TC10: Should prevent submission with empty required fields', async ({ page }) => {
      // Try to submit without filling any fields
      await page.getByTestId('complete-order-button').click();

      // Should remain on checkout page
      await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();

      // First name field should be focused (HTML5 validation)
      await expect(page.getByTestId('first-name-input')).toBeFocused();
    });

    test('TC10.1: Should validate email format', async ({ page }) => {
      // Fill all fields except email with invalid format
      await fillCheckoutForm(page, { email: 'invalid-email' });

      // Try to submit
      await page.getByTestId('complete-order-button').click();

      // Should remain on checkout page
      await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();
    });

    test('TC10.2: Should validate all required fields individually', async ({ page }) => {
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

      for (const field of requiredFields) {
        const input = page.getByTestId(field.testId);
        await expect(input).toBeVisible();
        await expect(input).toHaveAttribute('required', '');
      }
    });
  });

  test.describe('Order Completion', () => {
    test('TC9: Should complete checkout with valid data and clear cart', async ({ page }) => {
      // Add product to cart
      await addProductToCart(page, 1); // Backpack
      await goToCart(page);
      await page.getByTestId('increase-quantity-1').click();
      
      // Verify total before checkout
      await expect(page.locator('.cart-total').getByText('$59.98')).toBeVisible();
      await verifyCartBadge(page, 2);

      // Proceed to checkout
      await page.getByTestId('checkout-button').click();

      // Fill form with valid data
      await fillCheckoutForm(page);

      // Submit order
      await page.getByTestId('complete-order-button').click();

      // Wait for and verify order confirmation
      await expect(page.getByTestId('order-confirmation')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('Order Placed Successfully')).toBeVisible();
      await expect(page.getByText('Thank you for your purchase')).toBeVisible();
      await expect(page.getByText('$59.98')).toBeVisible();

      // Verify cart is cleared
      await verifyCartBadge(page, 0);

      // Verify returned to products page
      await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
      
      // Verify cart still empty
      await verifyCartBadge(page, 0);
    });

    test('TC9.1: Should complete checkout with different products', async ({ page }) => {
      // Add multiple products
      await addProductToCart(page, 2); // Bike Light $9.99
      await addProductToCart(page, 5); // Onesie $7.99
      await goToCart(page);

      const expectedTotal = '$17.98';
      await expect(page.getByText(expectedTotal)).toBeVisible();

      // Proceed to checkout
      await page.getByTestId('checkout-button').click();

      // Verify order summary
      await expect(page.getByText('Codemify Bike Light × 1')).toBeVisible();
      await expect(page.getByText('Codemify Onesie × 1')).toBeVisible();

      // Fill and submit
      await fillCheckoutForm(page);
      await page.getByTestId('complete-order-button').click();

      // Verify confirmation with correct total
      await expect(page.getByText('Order Placed Successfully')).toBeVisible();
      await expect(page.getByText(expectedTotal)).toBeVisible();
    });

    test('TC9.2: Should handle single item checkout', async ({ page }) => {
      // Add single product
      await addProductToCart(page, 3); // T-Shirt $15.99
      await goToCart(page);
      await page.getByTestId('checkout-button').click();

      // Fill and submit
      await fillCheckoutForm(page, {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com'
      });
      
      await page.getByTestId('complete-order-button').click();

      // Verify success
      await expect(page.getByText('Order Placed Successfully')).toBeVisible();
      await expect(page.getByText('$15.99')).toBeVisible();
    });
  });

  test.describe('Checkout Flow Integration', () => {
    test('Should complete full e2e workflow from browsing to order completion', async ({ page }) => {
      // Browse products
      await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
      await expect(page.locator('.product-card')).toHaveCount(6);

      // Add products to cart
      await addProductToCart(page, 1); // Backpack $29.99
      await addProductToCart(page, 4); // Fleece Jacket $49.99
      await verifyCartBadge(page, 2);

      // View cart
      await goToCart(page);
      await expect(page.getByRole('heading', { name: 'Your Shopping Cart' })).toBeVisible();
      await expect(page.getByText('$79.98')).toBeVisible();

      // Update quantity
      await page.getByTestId('increase-quantity-1').click();
      await expect(page.getByText('$109.97')).toBeVisible();
      await verifyCartBadge(page, 3);

      // Proceed to checkout
      await page.getByTestId('checkout-button').click();
      await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();

      // Complete checkout
      await fillCheckoutForm(page);
      await page.getByTestId('complete-order-button').click();

      // Verify success (wait for 2s processing + render time)
      await expect(page.getByTestId('order-confirmation')).toBeVisible();
      await verifyCartBadge(page, 0);

      // Return to shopping
      await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
    });
  });
});
