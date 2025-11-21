const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : '*',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Load products from local file with error handling
const PRODUCTS_FILE = path.join(__dirname, 'products.json');

const loadProducts = () => {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

const saveProducts = (products) => {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving products:', error);
    return false;
  }
};

// Get all products
app.get('/api/products', (req, res) => {
  const products = loadProducts();
  res.json(products);
});

// Get a single product
app.get('/api/products/:id', (req, res) => {
  const products = loadProducts();
  const product = products.find(p => p.id === parseInt(req.params.id));
  product ? res.json(product) : res.status(404).json({ message: 'Product not found' });
});

// Add a product (for testing POST)
app.post('/api/products', (req, res) => {
  try {
    const products = loadProducts();
    const newProduct = { id: Date.now(), ...req.body };
    products.push(newProduct);
    
    if (saveProducts(products)) {
      res.status(201).json(newProduct);
    } else {
      res.status(500).json({ error: 'Failed to save product' });
    }
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a product
app.delete('/api/products/:id', (req, res) => {
  try {
    let products = loadProducts();
    const initialLength = products.length;
    products = products.filter(p => p.id !== parseInt(req.params.id));
    
    if (products.length < initialLength) {
      if (saveProducts(products)) {
        res.json({ message: 'Product deleted successfully' });
      } else {
        res.status(500).json({ error: 'Failed to delete product' });
      }
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Export for Vercel serverless; only listen locally/development
if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}
