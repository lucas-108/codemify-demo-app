# Cypress to Playwright Migration Guide

## Overview

This guide provides step-by-step instructions for migrating the remaining Cypress e2e tests to Playwright. The `shopping-cart.cy.js` spec has been successfully migrated and serves as the reference implementation.

## Current Status

### ✅ Completed

- **shopping-cart.spec.js** - 8 tests migrated and passing
  - TC2, TC3, TC4, TC5, TC6, TC7, TC15, Empty cart state

### 📋 Remaining Specs (4 files, ~44 tests)

1. **checkout.cy.js** - 10 tests

   - TC8, TC9, TC9.1, TC9.2, TC10, TC10.1, TC10.2, TC11
   - Full e2e workflow test
   - Form validation tests

2. **product-catalog.cy.js** - 3 tests

   - TC1, TC1.1, TC1.2
   - Product display and navigation elements

3. **navigation.cy.js** - 11 tests

   - TC12, TC13, TC13.1, TC13.2, TC14, TC14.1
   - Cart state persistence, URL structure, keyboard navigation

4. **edge-cases.cy.js** - 20 tests
   - Maximum quantity, rapid clicks, decimal precision
   - Form validation edge cases, viewport resize
   - localStorage persistence, concurrent updates

---

## Migration Process

### Step 1: Analyze the Cypress Spec

Before migrating each file:

1. **Read the test file** to understand test structure and dependencies
2. **Identify unique selectors** not used in shopping-cart tests
3. **Check for custom commands** - most are already in `tests/helpers.js`
4. **Note any special setup** (timeouts, waits, intercepts)

### Step 2: Create Playwright Spec File

Use this template structure:

```javascript
/**
 * Test Suite: [Suite Name]
 *
 * [Description of what this suite tests]
 *
 * Migrated from Cypress to Playwright
 */

import { test, expect } from "@playwright/test";
import {
  clearCart,
  addProductToCart,
  verifyCartBadge,
  goToCart,
  goToProducts,
  fillCheckoutForm,
} from "./helpers.js";

test.describe("[Suite Name]", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Add any additional setup
  });

  test.describe("[Context Group]", () => {
    test("TC#: [Test Description]", async ({ page }) => {
      // Test implementation
    });
  });
});
```

### Step 3: Convert Cypress Commands to Playwright

#### Common Conversions

| Cypress                       | Playwright                         |
| ----------------------------- | ---------------------------------- |
| `cy.visit('/')`               | `await page.goto('/')`             |
| `cy.get('[data-testid="x"]')` | `page.getByTestId('x')`            |
| `cy.contains('text')`         | `page.getByText('text')`           |
| `cy.get('button').click()`    | `page.getByRole('button').click()` |
| `.should('be.visible')`       | `expect(...).toBeVisible()`        |
| `.should('have.length', 3)`   | `expect(...).toHaveCount(3)`       |
| `.should('have.text', 'x')`   | `expect(...).toHaveText('x')`      |
| `.should('have.value', 'x')`  | `expect(...).toHaveValue('x')`     |
| `.should('not.exist')`        | `expect(...).not.toBeVisible()`    |
| `.should('have.class', 'x')`  | `expect(...).toHaveClass(/.*x.*/)` |
| `.type('text')`               | `fill('text')`                     |
| `.clear()`                    | `fill('')`                         |
| `.select('option')`           | `selectOption('option')`           |
| `.check()`                    | `check()`                          |
| `.within(() => {})`           | `locator.locator()` scoping        |
| `.each(($el) => {})`          | `for` loop with `.nth(i)`          |

#### Custom Commands (Already Available)

- `cy.clearCart()` → `clearCart(page)`
- `cy.addProductToCart(id)` → `addProductToCart(page, id)`
- `cy.verifyCartBadge(count)` → `verifyCartBadge(page, count)`
- `cy.goToCart()` → `goToCart(page)`
- `cy.goToProducts()` → `goToProducts(page)`
- `cy.fillCheckoutForm(data)` → `fillCheckoutForm(page, data)`

### Step 4: Handle Common Patterns

#### Pattern 1: Chained Assertions

```javascript
// Cypress
cy.get(".item").should("be.visible").and("have.text", "Hello");

// Playwright
const item = page.locator(".item");
await expect(item).toBeVisible();
await expect(item).toHaveText("Hello");
```

#### Pattern 2: Within/Scoping

```javascript
// Cypress
cy.get(".cart-item").within(() => {
  cy.get("h3").should("contain", "Product");
});

// Playwright
const cartItem = page.locator(".cart-item");
await expect(cartItem.locator("h3")).toContainText("Product");
```

#### Pattern 3: Iterating Elements

```javascript
// Cypress
cy.get(".cart-item").each(($item) => {
  cy.wrap($item).find("img").should("be.visible");
});

// Playwright
const items = page.locator(".cart-item");
const count = await items.count();
for (let i = 0; i < count; i++) {
  await expect(items.nth(i).locator("img")).toBeVisible();
}
```

#### Pattern 4: Navigation Button Selection

```javascript
// ⚠️ IMPORTANT: Be specific with navigation buttons to avoid ambiguity

// ❌ Don't use (matches too many elements)
page.getByRole("button", { name: "Cart" });

// ✅ Do use
page.locator("button.nav-link", { hasText: "Cart" });
```

#### Pattern 5: Price/Total Selectors

```javascript
// ⚠️ IMPORTANT: Be specific when prices appear multiple times

// ❌ Don't use (ambiguous)
page.getByText("$29.99");

// ✅ Do use (scoped)
page.locator(".cart-total").getByText("$29.99");
```

### Step 5: Run and Debug Tests

```bash
# Run specific spec
npm run playwright -- tests/[spec-name].spec.js

# Run with browser UI (helpful for debugging)
npm run playwright:headed -- tests/[spec-name].spec.js

# Run in debug mode (step through tests)
npm run playwright:debug -- tests/[spec-name].spec.js

# Run in interactive UI mode
npm run playwright:ui
```

### Step 6: Fix Common Issues

#### Issue 1: Strict Mode Violations

**Error:** `strict mode violation: locator resolved to X elements`

**Solution:** Make selectors more specific

```javascript
// Add scoping or more specific selectors
page.locator(".container").getByText("text");
page.locator("button.specific-class", { hasText: "Button" });
```

#### Issue 2: Timing Issues

**Error:** `Timeout exceeded while waiting for element`

**Solution:** Playwright auto-waits, but you may need:

```javascript
// Wait for specific state
await page.waitForLoadState("networkidle");

// Wait for element
await page.waitForSelector(".element");

// Increase timeout for slow operations
await expect(page.getByText("text")).toBeVisible({ timeout: 10000 });
```

#### Issue 3: Class Assertions

**Error:** `toHaveClass(expected) failed`

**Solution:** Use regex to match class lists

```javascript
// ❌ Don't
await expect(element).toHaveClass("active");

// ✅ Do
await expect(element).toHaveClass(/.*active.*/);
```

---

## Migration Checklist (Per Spec)

### Pre-Migration

- [ ] Read the Cypress spec thoroughly
- [ ] Identify test dependencies and setup requirements
- [ ] List unique selectors/patterns not seen before
- [ ] Check if new helper functions are needed

### During Migration

- [ ] Create new spec file: `tests/[name].spec.js`
- [ ] Import Playwright test utilities and helpers
- [ ] Convert `describe` → `test.describe`
- [ ] Convert `it` → `test`
- [ ] Convert `beforeEach` hook with `page.goto('/')`
- [ ] Migrate all test cases
- [ ] Update selectors following best practices
- [ ] Add type annotations where helpful

### Post-Migration

- [ ] Run tests: `npm run playwright -- tests/[name].spec.js`
- [ ] Fix any strict mode violations
- [ ] Fix any timeout issues
- [ ] Verify all assertions pass
- [ ] Run with all browsers: `npm run playwright`
- [ ] Compare with Cypress results for accuracy

---

## Suggested Migration Order

1. **product-catalog.spec.js** (Easiest)

   - Simple display tests
   - Few interactions
   - Good warm-up

2. **navigation.spec.js** (Medium)

   - Navigation patterns
   - State persistence checks
   - Keyboard interaction

3. **checkout.spec.js** (Medium-Hard)

   - Form interactions
   - Uses `fillCheckoutForm()` helper
   - Order completion flow

4. **edge-cases.spec.js** (Hardest)
   - Many edge cases
   - Timing-sensitive tests
   - Complex state scenarios

---

## Helper Functions Available

Located in `tests/helpers.js`:

```javascript
// Cart Management
clearCart(page); // Clear localStorage and reload
addProductToCart(page, productId); // Add product to cart
verifyCartBadge(page, count); // Verify cart badge count

// Navigation
goToCart(page); // Navigate to cart view
goToProducts(page); // Navigate to products view

// Forms
fillCheckoutForm(page, formData); // Fill checkout form with data
```

### Adding New Helpers

If you need additional helpers:

1. Add to `tests/helpers.js` following existing patterns
2. Export the function
3. Import in your spec file
4. Use JSDoc comments for type hints

Example:

```javascript
/**
 * New helper description
 * @param {import('@playwright/test').Page} page
 * @param {string} parameter - Description
 */
export async function newHelper(page, parameter) {
  // Implementation
}
```

---

## Testing Best Practices

### 1. Use Semantic Selectors

```javascript
// Best to worst priority
page.getByRole("button", { name: "Submit" });
page.getByTestId("submit-button");
page.getByText("Submit");
page.locator("button.submit");
page.locator(".submit-btn");
```

### 2. Avoid Hardcoded Waits

```javascript
// ❌ Don't
await page.waitForTimeout(1000);

// ✅ Do
await expect(page.getByText("Loaded")).toBeVisible();
```

### 3. Scope Locators

```javascript
// ✅ Better
const cartSection = page.locator(".cart-section");
await expect(cartSection.getByText("Total")).toBeVisible();
```

### 4. Use Descriptive Test Names

```javascript
// ✅ Good
test('TC8: Should navigate to checkout page with correct order summary', ...)

// ❌ Bad
test('checkout test', ...)
```

---

## Configuration Reference

### Playwright Config (`playwright.config.js`)

Key settings:

- **baseURL:** `https://codemify-demo-app.vercel.app/demo-app`
- **viewport:** 1280×720 (matching Cypress)
- **timeout:** 30 seconds per test
- **retries:** 2 in CI, 0 locally
- **parallel:** Enabled (4 workers default)
- **video:** Retained on failure
- **screenshots:** On failure only

### Browser Projects

Tests run on 3 browsers by default:

- Chromium (Chrome/Edge)
- Firefox
- WebKit (Safari)

Run specific browser:

```bash
npm run playwright:chrome
npm run playwright:firefox
npm run playwright:webkit
```

---

## Troubleshooting

### Tests Fail Locally but Pass in Cypress

1. **Check viewport size** - Playwright and Cypress should match
2. **Verify baseURL** - Ensure it matches Cypress config
3. **Check for timing issues** - Add explicit waits if needed
4. **Compare screenshots** - Use Playwright's screenshot feature

### Tests Are Flaky

1. **Add stricter waits**

   ```javascript
   await page.waitForLoadState("networkidle");
   ```

2. **Check for race conditions**

   ```javascript
   await expect(element).toBeVisible();
   await element.click(); // Wait for visible first
   ```

3. **Increase timeout for slow operations**
   ```javascript
   test.setTimeout(60000); // 60 seconds for this test
   ```

### Cannot Find Element

1. **Verify selector in browser**

   ```bash
   npm run playwright:debug -- tests/spec.spec.js
   ```

2. **Check element exists in DOM**

   ```javascript
   await page.pause(); // Opens inspector
   ```

3. **Use Playwright Inspector**
   - Hover over elements
   - Copy selectors
   - Step through test execution

---

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Migration from Cypress](https://playwright.dev/docs/migrating)
- [Locators Guide](https://playwright.dev/docs/locators)
- [Best Practices](https://playwright.dev/docs/best-practices)

---

## Success Criteria

A migration is complete when:

✅ All tests pass consistently  
✅ Test coverage matches original Cypress spec  
✅ No strict mode violations  
✅ No hardcoded waits  
✅ Tests run in parallel without issues  
✅ Tests pass on all 3 browser projects

---

## Questions?

Reference the successfully migrated `shopping-cart.spec.js` as the gold standard for:

- File structure
- Import patterns
- Helper function usage
- Assertion styles
- Comment formatting
