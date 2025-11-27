# Manual Test Cases - Codemify Store

**Application URL:** https://codemify-demo-app.vercel.app/demo-app  
**Test Date:** November 26, 2025  
**Test Status:** ✅ All Critical Workflows Passed

---

## Test Case 1: Product Catalog Display

**Objective:** Verify that the product catalog displays correctly with all product information.

**Preconditions:**

- Navigate to the application URL
- Application loads successfully

**Test Steps:**

1. Open the application in a web browser
2. Observe the products page

**Expected Results:**

- The page displays "Products" heading with item count (6 items)
- All 6 products are displayed in a grid layout
- Each product card shows:
  - Product image
  - Product name
  - Product description
  - Product price
  - "Add to Cart" button
- Products displayed include:
  - Codemify Backpack ($29.99)
  - Codemify Bike Light ($9.99)
  - Codemify Bolt T-Shirt ($15.99)
  - Codemify Fleece Jacket ($49.99)
  - Codemify Onesie ($7.99)
  - Test.allTheThings() T-Shirt (Red) ($15.99)

**Actual Results:** ✅ Passed - All products displayed correctly with proper formatting and information

---

## Test Case 2: Add Single Product to Cart

**Objective:** Verify that users can add a product to the shopping cart and the cart badge updates correctly.

**Preconditions:**

- On the products page
- Cart is empty (no badge or badge shows 0)

**Test Steps:**

1. Locate the "Codemify Backpack" product
2. Click the "Add to Cart" button

**Expected Results:**

- The "Add to Cart" button shows an active/clicked state
- The cart badge in the navigation bar appears and displays "1"
- The product is added to the cart

**Actual Results:** ✅ Passed - Cart badge updated to show 1 item, button showed active state

---

## Test Case 3: Add Multiple Products to Cart

**Objective:** Verify that multiple different products can be added to the cart and the count updates correctly.

**Preconditions:**

- On the products page
- Cart contains 1 item (from previous test)

**Test Steps:**

1. Click "Add to Cart" on "Codemify Bike Light"
2. Observe cart badge
3. Click "Add to Cart" on "Codemify Bolt T-Shirt"
4. Observe cart badge

**Expected Results:**

- After adding Bike Light, cart badge shows "2"
- After adding T-Shirt, cart badge shows "3"
- Each clicked button shows active state
- All three products are in the cart

**Actual Results:** ✅ Passed - Cart badge incremented correctly (1 → 2 → 3)

---

## Test Case 4: View Shopping Cart

**Objective:** Verify that the shopping cart displays all added items with correct information.

**Preconditions:**

- Cart contains 3 items (Backpack, Bike Light, T-Shirt)

**Test Steps:**

1. Click the "Cart" button in the navigation bar

**Expected Results:**

- Page navigates to "Your Shopping Cart" view
- Cart button shows active state
- All 3 items are displayed with:
  - Product image
  - Product name
  - Product description
  - Unit price
  - Quantity (1 for each)
  - Subtotal calculation (price × quantity)
  - Quantity controls (- and + buttons)
  - Remove button
- Total is calculated correctly: $29.99 + $9.99 + $15.99 = $55.97
- "Continue Shopping" and "Proceed to Checkout" buttons are visible

**Actual Results:** ✅ Passed - Cart displayed all items correctly with accurate pricing

---

## Test Case 5: Increase Product Quantity in Cart

**Objective:** Verify that users can increase the quantity of a product in the cart and all totals update correctly.

**Preconditions:**

- In cart view
- Codemify Backpack has quantity of 1

**Test Steps:**

1. Locate the Codemify Backpack in the cart
2. Click the "+" button to increase quantity

**Expected Results:**

- Backpack quantity increases from 1 to 2
- Backpack subtotal updates from $29.99 to $59.98
- Cart badge updates from 3 to 4
- Cart total updates from $55.97 to $85.96
- Plus button shows active state

**Actual Results:** ✅ Passed - Quantity and all totals updated correctly

---

## Test Case 6: Decrease Product Quantity (Auto-Remove at Zero)

**Objective:** Verify that decreasing quantity from 1 automatically removes the product from cart.

**Preconditions:**

- In cart view
- Codemify Bike Light has quantity of 1
- Cart contains multiple items

**Test Steps:**

1. Locate the Codemify Bike Light in the cart
2. Click the "-" button to decrease quantity

**Expected Results:**

- Bike Light is removed from the cart (no longer visible)
- Cart badge updates from 4 to 3
- Cart total updates from $85.96 to $75.97 (removing $9.99)
- Remaining items (Backpack and T-Shirt) still displayed

**Actual Results:** ✅ Passed - Item removed when quantity decreased from 1, totals updated correctly

---

## Test Case 7: Remove Product from Cart

**Objective:** Verify that the Remove button successfully removes a product from the cart.

**Preconditions:**

- In cart view
- Cart contains multiple items
- Codemify Bolt T-Shirt is in the cart

**Test Steps:**

1. Locate the Codemify Bolt T-Shirt in the cart
2. Click the "Remove" button

**Expected Results:**

- T-Shirt is removed from the cart (no longer visible)
- Cart badge updates from 3 to 2
- Cart total updates from $75.97 to $59.98 (removing $15.99)
- Remaining items still displayed correctly

**Actual Results:** ✅ Passed - T-Shirt removed, badge and total updated correctly

---

## Test Case 8: Proceed to Checkout

**Objective:** Verify that users can navigate to the checkout page from the cart.

**Preconditions:**

- In cart view
- Cart contains at least one item (2 Backpacks totaling $59.98)

**Test Steps:**

1. Click the "Proceed to Checkout" button

**Expected Results:**

- Page navigates to checkout view
- Checkout page displays "Checkout" heading
- Order Summary section shows:
  - Item name and quantity: "Codemify Backpack × 2"
  - Item total: $59.98
  - Order total: $59.98
- Shipping Information form is displayed with fields:
  - First Name (required)
  - Last Name (required)
  - Email (required)
  - Address (required)
  - City (required)
  - State (required)
  - Zip Code (required with placeholder)
- Payment Information form is displayed with fields:
  - Card Number (required with placeholder)
  - Expiry Date (required with placeholder MM/YY)
  - CVV (required with placeholder)
- "Cancel" and "Complete Order" buttons are visible

**Actual Results:** ✅ Passed - Checkout page loaded with correct order summary and all form fields

---

## Test Case 9: Complete Checkout with Valid Data

**Objective:** Verify that users can successfully complete an order with valid information.

**Preconditions:**

- On checkout page
- Cart contains items totaling $59.98

**Test Steps:**

1. Fill in Shipping Information:
   - First Name: "John"
   - Last Name: "Doe"
   - Email: "john.doe@example.com"
   - Address: "123 Main Street"
   - City: "San Francisco"
   - State: "CA"
   - Zip Code: "94102"
2. Fill in Payment Information:
   - Card Number: "4532015112830366"
   - Expiry Date: "12/25"
   - CVV: "123"
3. Click "Complete Order" button

**Expected Results:**

- Order is successfully submitted
- Order confirmation page displays:
  - Success message: "✅ Order Placed Successfully!"
  - Thank you message
  - Order total: $59.98
  - "Continue Shopping" button
- Cart is cleared (badge removed or shows 0)
- User can click "Continue Shopping" to return to products

**Actual Results:** ✅ Passed - Order submitted successfully, confirmation displayed, cart cleared

---

## Test Case 10: Form Validation - Required Fields

**Objective:** Verify that the checkout form validates required fields and prevents submission with incomplete data.

**Preconditions:**

- Add a product to cart (Codemify Onesie, $7.99)
- Navigate to checkout page

**Test Steps:**

1. Leave all required fields empty
2. Enter invalid email: "invalid-email" in Email field
3. Click "Complete Order" button

**Expected Results:**

- Form submission is prevented
- Browser focuses on the first empty required field (First Name)
- No order confirmation is displayed
- User remains on checkout page
- Form data is not lost

**Actual Results:** ✅ Passed - Form validation prevented submission, focused on first empty field

---

## Test Case 11: Cancel Checkout

**Objective:** Verify that users can cancel the checkout process and return to the cart.

**Preconditions:**

- On checkout page
- Cart contains items

**Test Steps:**

1. Click the "Cancel" button

**Expected Results:**

- Page navigates back to cart view
- Cart still contains all items
- Cart totals remain unchanged
- User can continue shopping or try checkout again

**Actual Results:** ✅ Passed - Returned to cart, items preserved

---

## Test Case 12: Continue Shopping from Cart

**Objective:** Verify that users can return to the product catalog from the cart view.

**Preconditions:**

- In cart view
- Cart contains items

**Test Steps:**

1. Click "Continue Shopping" button

**Expected Results:**

- Page navigates to products view
- All 6 products are displayed
- Cart badge still shows current item count
- Cart contents are preserved

**Actual Results:** ✅ Passed - Returned to products, cart preserved

---

## Test Case 13: Navigation - Store Logo

**Objective:** Verify that clicking the store logo/name returns to the products page.

**Preconditions:**

- Can be on any page (products, cart, or checkout)

**Test Steps:**

1. Click on "🛒 Codemify Store" heading/logo

**Expected Results:**

- Page navigates to products view
- Products page displays correctly
- Cart badge (if present) remains unchanged

**Actual Results:** ✅ Passed - Logo navigation works correctly

---

## Test Case 14: Navigation Between Products and Cart

**Objective:** Verify that users can switch between Products and Cart views using navigation buttons.

**Preconditions:**

- On any main page
- Cart contains items

**Test Steps:**

1. Click "Products" button in navigation
2. Observe the page
3. Click "Cart" button in navigation
4. Observe the page

**Expected Results:**

- Clicking "Products" shows products view with active button state
- Clicking "Cart" shows cart view with active button state
- Cart contents persist across navigation
- Cart badge displays consistently

**Actual Results:** ✅ Passed - Navigation buttons work correctly with proper active states

---

## Test Case 15: Cart Badge Persistence

**Objective:** Verify that the cart badge accurately reflects the total quantity across all navigation.

**Preconditions:**

- Start with empty cart

**Test Steps:**

1. Add 1 Backpack (badge should show 1)
2. Navigate to cart and increase quantity to 2 (badge should show 2)
3. Return to products
4. Add 1 Bike Light (badge should show 3)
5. Navigate to cart
6. Remove Bike Light (badge should show 2)

**Expected Results:**

- Badge updates immediately after each action
- Badge count equals sum of all item quantities
- Badge persists across all page views
- Badge displays correctly in navigation bar

**Actual Results:** ✅ Passed - Badge updates accurately throughout all workflows

---

## Known Issues

### Non-Critical Issues:

1. **Missing Favicon** - The application shows a 404 error for `/favicon.ico`
   - Impact: Minor cosmetic issue, no functionality affected
   - Browser displays default icon instead of custom favicon

---

## Test Environment

- **Application URL:** https://codemify-demo-app.vercel.app/demo-app
- **Browser:** Chromium (Playwright)
- **Testing Tool:** Playwright Browser Automation
- **Test Date:** November 26, 2025

---

## Summary

**Total Test Cases:** 15  
**Passed:** 15 ✅  
**Failed:** 0 ❌  
**Blocked:** 0 ⚠️

All critical user workflows are functioning correctly. The e-commerce application successfully handles:

- Product browsing and display
- Shopping cart management (add, update, remove)
- Quantity adjustments with automatic calculations
- Checkout process with form validation
- Order completion and confirmation
- Navigation between all major views
- State persistence across navigation

The application is ready for production use with only minor cosmetic improvements needed (favicon).
