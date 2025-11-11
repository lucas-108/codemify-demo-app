const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;

// Load products from local file
const loadProducts = () => JSON.parse(fs.readFileSync('./products.json'));

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
  const products = loadProducts();
  const newProduct = { id: Date.now(), ...req.body };
  products.push(newProduct);
  // Bug: Don't save the data to file
  // fs.writeFileSync('./products.json', JSON.stringify(products, null, 2));
  res.status(201).json(newProduct);
});

// Delete a product
app.delete('/api/products/:id', (req, res) => {
  let products = loadProducts();
  products = products.filter(p => p.id !== parseInt(req.params.id));
  fs.writeFileSync('./products.json', JSON.stringify(products, null, 2));
  res.json({ message: 'Deleted' });
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
