/**
 * Playwright Helper Functions
 * 
 * These helper functions replicate the custom Cypress commands
 * for use in Playwright tests.
 */

/**
 * Clears the shopping cart by clearing localStorage and reloading
 * @param {import('@playwright/test').Page} page
 */
export async function clearCart(page) {
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

/**
 * Adds a product to the cart by clicking the add-to-cart button
 * @param {import('@playwright/test').Page} page
 * @param {number} productId - The ID of the product to add
 */
export async function addProductToCart(page, productId) {
  await page.getByTestId(`add-to-cart-${productId}`).click();
}

/**
 * Verifies the cart badge displays the correct count
 * @param {import('@playwright/test').Page} page
 * @param {number} count - Expected cart item count
 */
export async function verifyCartBadge(page, count) {
  const { expect } = await import('@playwright/test');
  
  if (count === 0) {
    // Badge should not exist when cart is empty
    await expect(page.locator('.cart-badge')).not.toBeVisible();
  } else {
    // Badge should exist and display the correct count
    const badge = page.locator('.cart-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText(count.toString());
  }
}

/**
 * Navigates to the cart view
 * @param {import('@playwright/test').Page} page
 */
export async function goToCart(page) {
  await page.locator('button.nav-link', { hasText: 'Cart' }).click();
}

/**
 * Navigates to the products view
 * @param {import('@playwright/test').Page} page
 */
export async function goToProducts(page) {
  await page.locator('button.nav-link', { hasText: 'Products' }).click();
}

/**
 * Fills out the checkout form with provided or default data
 * @param {import('@playwright/test').Page} page
 * @param {Object} formData - Optional form data to override defaults
 */
export async function fillCheckoutForm(page, formData = {}) {
  const defaultData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    address: '123 Main Street',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    cardNumber: '4111111111111111',
    expiryDate: '12/25',
    cvv: '123',
  };

  const data = { ...defaultData, ...formData };

  await page.getByTestId('first-name-input').fill(data.firstName);
  await page.getByTestId('last-name-input').fill(data.lastName);
  await page.getByTestId('email-input').fill(data.email);
  await page.getByTestId('address-input').fill(data.address);
  await page.getByTestId('city-input').fill(data.city);
  await page.getByTestId('state-input').fill(data.state);
  await page.getByTestId('zip-code-input').fill(data.zipCode);
  await page.getByTestId('card-number-input').fill(data.cardNumber);
  await page.getByTestId('expiry-date-input').fill(data.expiryDate);
  await page.getByTestId('cvv-input').fill(data.cvv);
}
