# 🛒 E-Commerce Demo Application

A full-stack JavaScript e-commerce application designed for testing framework demonstration purposes. This application features a modern React frontend and Express.js backend.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green)
![React](https://img.shields.io/badge/react-18.0.0-blue)

## 📋 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Testing Opportunities](#-testing-opportunities)
- [Technology Stack](#-technology-stack)

## ✨ Features

### Frontend

- 🎨 Modern, responsive UI with product cards and images
- 🛍️ Product catalog with detailed product information
- 🛒 Shopping cart with quantity management
- 💳 Complete checkout flow with form validation
- 📱 Mobile-friendly responsive design
- 🎯 Test-friendly with data-testid attributes

### Backend

- 🚀 RESTful API with Express.js
- 📦 CRUD operations for products
- 💾 File-based data persistence (JSON)
- 🔄 CORS enabled for cross-origin requests
- ⚡ Lightweight and easy to extend

## 📁 Project Structure

```
Codemify Demo App/
├── backend/
│   ├── server.js          # Express server and API endpoints
│   ├── products.json      # Product data storage
│   └── package.json       # Backend dependencies
├── frontend/
│   ├── public/
│   │   └── index.html     # HTML entry point
│   ├── src/
│   │   ├── App.js         # Main application component
│   │   ├── App.css        # Global styles
│   │   ├── ProductList.js # Product listing component
│   │   ├── Cart.js        # Shopping cart component
│   │   ├── Checkout.js    # Checkout form component
│   │   └── index.js       # React entry point
│   └── package.json       # Frontend dependencies
└── README.md
```

## 🔧 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- A web browser (Chrome, Firefox, Safari, or Edge)
- A code editor (VS Code recommended)

## 📥 Installation

1. **Clone the project:**

2. **Install backend dependencies:**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

## 🚀 Running the Application

You need to run both the backend and frontend servers:

### Start the Backend Server

```bash
cd backend
npm start
```

The backend will start on **http://localhost:4000**

### Start the Frontend Server

In a new terminal window:

```bash
cd frontend
npm start
```

The frontend will start on **http://localhost:3000** and automatically open in your browser.

## 🔌 API Endpoints

The backend provides the following RESTful API endpoints:

| Method   | Endpoint            | Description                |
| -------- | ------------------- | -------------------------- |
| `GET`    | `/api/products`     | Get all products           |
| `GET`    | `/api/products/:id` | Get a single product by ID |
| `POST`   | `/api/products`     | Create a new product       |
| `DELETE` | `/api/products/:id` | Delete a product by ID     |

### Example API Usage

**Get all products:**

```bash
curl http://localhost:4000/api/products
```

**Get a single product:**

```bash
curl http://localhost:4000/api/products/1
```

**Create a new product:**

```bash
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "price": 19.99,
    "description": "A great product",
    "category": "Test",
    "stock": 100,
    "image": "https://example.com/image.jpg"
  }'
```

**Delete a product:**

```bash
curl -X DELETE http://localhost:4000/api/products/1
```

## 🧪 Testing Opportunities

This application is specifically designed to demonstrate various testing approaches:

### Unit Testing

- Test individual React components (ProductList, Cart, Checkout)
- Test backend API route handlers
- Test utility functions and state management
- Validate form input handling

### Integration Testing

- Test API endpoints with Supertest or similar
- Test component interactions
- Test data flow between frontend and backend
- Validate CRUD operations

### End-to-End Testing

Perfect scenarios for E2E testing with tools like Cypress, Playwright, or Selenium:

1. **Product Browsing Flow**

   - Load the product catalog
   - View product details
   - Navigate between pages

2. **Shopping Cart Flow**

   - Add products to cart
   - Update quantities
   - Remove items from cart
   - View cart total

3. **Checkout Flow**
   - Navigate to checkout
   - Fill out shipping information
   - Enter payment details
   - Complete order
   - Verify success message

### Test-Friendly Features

- **data-testid attributes** on key elements for easy selection
- **Predictable state management** for reliable testing
- **RESTful API** for easy mocking and stubbing
- **Form validation** for input testing scenarios
- **Responsive design** for viewport testing

### Sample Test Selectors

The application includes test IDs for automation:

- `add-to-cart-{id}` - Add to cart buttons
- `remove-from-cart-{id}` - Remove from cart buttons
- `increase-quantity-{id}` - Increase quantity buttons
- `decrease-quantity-{id}` - Decrease quantity buttons
- `checkout-button` - Proceed to checkout button
- `complete-order-button` - Complete order button
- Form inputs with descriptive IDs (first-name-input, email-input, etc.)

## 🛠️ Technology Stack

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **CORS** - Cross-origin resource sharing
- **File System (fs)** - Data persistence

### Frontend

- **React** - UI library
- **React Hooks** - State management
- **CSS3** - Styling and responsive design
- **Fetch API** - HTTP requests

### Development Tools

- **npm** - Package management
- **React Scripts** - Build tooling
- **Nodemon** (optional) - Auto-restart server

## 📝 Product Data

The application comes with 6 pre-loaded products:

- Codemify Backpack ($29.99)
- Codemify Bike Light ($9.99)
- Codemify Bolt T-Shirt ($15.99)
- Codemify Fleece Jacket ($49.99)
- Codemify Onesie ($7.99)
- Test.allTheThings() T-Shirt ($15.99)

All products include images, descriptions, and stock information.

## 🎯 Use Cases for Testing Frameworks

This application is ideal for demonstrating:

1. **Test Automation Frameworks**

   - Selenium WebDriver
   - Cypress
   - Playwright
   - Puppeteer
   - TestCafe

2. **API Testing Tools**

   - Postman
   - REST Assured
   - Supertest
   - Jest with API mocking

3. **Unit Testing Frameworks**

   - Jest
   - React Testing Library
   - Mocha/Chai

4. **Visual Testing**
   - Percy
   - Applitools
   - BackstopJS

## 🤝 Contributing

This is a demo application for testing purposes. Feel free to modify and extend it for your testing demonstrations.

## 📄 License

MIT License - Feel free to use this for educational and demonstration purposes.

## 🆘 Troubleshooting

**Port already in use:**
If you get a port conflict error, you can change the ports in:

- Backend: Edit `PORT` in `backend/server.js`
- Frontend: Set `PORT` environment variable before running

**CORS errors:**
Make sure the backend is running before starting the frontend.

**Module not found:**
Run `npm install` in both backend and frontend directories.

## 📧 Support

For issues or questions about this demo application, please refer to the code comments or create an issue in your repository.

---

**Happy Testing! 🚀**
