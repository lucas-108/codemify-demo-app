# Cypress E2E Tests - Codemify Store

This directory contains end-to-end (E2E) automated tests for the Codemify Store application using Cypress.

## Test Coverage

The test suite provides comprehensive coverage of all critical user workflows:

### Test Suites

1. **Product Catalog** (`product-catalog.cy.js`)

   - Product display verification
   - Product information accuracy
   - Image loading
   - Navigation elements

2. **Shopping Cart** (`shopping-cart.cy.js`)

   - Adding products to cart
   - Viewing cart contents
   - Updating quantities
   - Removing items
   - Cart badge persistence
   - Empty cart handling

3. **Checkout Process** (`checkout.cy.js`)

   - Checkout navigation
   - Form validation
   - Order completion
   - End-to-end workflow
   - Cart clearing after purchase

4. **Navigation** (`navigation.cy.js`)

   - Navigation between pages
   - Active state management
   - Store logo navigation
   - Continue Shopping functionality
   - State persistence

5. **Edge Cases** (`edge-cases.cy.js`)
   - Maximum quantities
   - Rapid interactions
   - Price calculations
   - Form validation edge cases
   - Browser state persistence
   - Responsive design
   - Concurrent actions

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:

   ```bash
   cd frontend
   npm install cypress --save-dev
   ```

2. Install additional Cypress plugins (optional):
   ```bash
   npm install -D cypress-real-events @testing-library/cypress
   ```

## Running Tests

### Interactive Mode (Cypress Test Runner)

Open Cypress Test Runner for interactive test development and debugging:

```bash
npx cypress open
```

This will open the Cypress GUI where you can:

- Select and run individual test files
- Watch tests run in real-time
- Use the time-travel debugger
- View screenshots and videos

### Headless Mode (CI/CD)

Run all tests in headless mode:

```bash
npx cypress run
```

Run specific test suite:

```bash
npx cypress run --spec "cypress/e2e/shopping-cart.cy.js"
```

Run tests in specific browser:

```bash
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser edge
```

### NPM Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "cypress:run:chrome": "cypress run --browser chrome",
    "cypress:run:firefox": "cypress run --browser firefox",
    "test:e2e": "cypress run",
    "test:e2e:headed": "cypress run --headed"
  }
}
```

Then run with:

```bash
npm run cypress:open
npm run test:e2e
```

## Test Structure

### Custom Commands

Located in `cypress/support/commands.js`:

- `cy.clearCart()` - Clears the shopping cart and reloads the page
- `cy.addProductToCart(productId)` - Adds a product to cart by ID
- `cy.verifyCartBadge(count)` - Verifies cart badge shows expected count
- `cy.goToCart()` - Navigates to the cart page
- `cy.goToProducts()` - Navigates to the products page
- `cy.fillCheckoutForm(formData)` - Fills checkout form with test data

### Test Organization

Tests are organized by feature/functionality:

- Each file contains related test cases
- Tests use descriptive names matching manual test case IDs
- `beforeEach` hooks ensure clean state for each test
- Context blocks group related tests

## Configuration

### cypress.config.js

Main configuration file:

- `baseUrl`: Application URL
- `viewportWidth/Height`: Default browser dimensions
- `video`: Enable/disable video recording
- `screenshotOnRunFailure`: Automatic screenshots on failure

### Environment Variables

Set in `cypress.env.json` or via command line:

```bash
npx cypress run --env viewportWidth=1920,viewportHeight=1080
```

## Test Data

### Product IDs

1. Codemify Backpack - $29.99
2. Codemify Bike Light - $9.99
3. Codemify Bolt T-Shirt - $15.99
4. Codemify Fleece Jacket - $49.99
5. Codemify Onesie - $7.99
6. Test.allTheThings() T-Shirt (Red) - $15.99

### Test User Data

Default checkout form data (can be overridden):

```javascript
{
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  address: '123 Main Street',
  city: 'San Francisco',
  state: 'CA',
  zipCode: '94102',
  cardNumber: '4532015112830366',
  expiryDate: '12/25',
  cvv: '123'
}
```

## Debugging

### Debug Tools

- **Cypress Test Runner**: Visual debugging with time-travel
- **Console Logs**: Use `cy.log('message')` in tests
- **Screenshots**: Automatically captured on failures
- **Videos**: Recorded for each test run
- **Pause**: Use `cy.pause()` to pause test execution

### Debug Commands

```javascript
// Pause test execution
cy.pause();

// Add debug point
cy.debug();

// Log to console
cy.log("Debug message");

// Get element and debug
cy.get('[data-testid="cart-badge"]').debug();
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: cd frontend && npm ci
      - name: Run Cypress tests
        run: cd frontend && npm run test:e2e
      - name: Upload screenshots
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: cypress-screenshots
          path: frontend/cypress/screenshots
```

## Best Practices

1. **Test Independence**: Each test should be independent and not rely on others
2. **Clean State**: Use `beforeEach` to ensure clean state
3. **Explicit Waits**: Use Cypress built-in retry-ability instead of hard waits
4. **Data Attributes**: Prefer `data-testid` selectors over CSS classes
5. **Custom Commands**: Reuse common actions via custom commands
6. **Assertions**: Make meaningful assertions about application state
7. **Error Messages**: Use descriptive test names and assertions

## Troubleshooting

### Common Issues

**Issue**: Tests fail with "element not found"

- **Solution**: Ensure selectors match actual HTML structure
- Check for dynamic content loading

**Issue**: Tests are flaky

- **Solution**: Add appropriate waits or assertions
- Use Cypress's automatic retry logic

**Issue**: Videos not recording

- **Solution**: Check `video: true` in `cypress.config.js`
- Ensure write permissions for video directory

## Test Metrics

Current test coverage:

- **Total Test Cases**: 15 manual test cases
- **Automated Tests**: 40+ automated test scenarios
- **Test Files**: 5 test suites
- **Custom Commands**: 6 reusable commands
- **Coverage**: All critical user workflows

## Resources

- [Cypress Documentation](https://docs.cypress.io)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress API](https://docs.cypress.io/api/table-of-contents)
- [Manual Test Cases](../test-cases/manual-test-cases.md)
