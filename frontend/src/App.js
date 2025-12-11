import React, { useState, useEffect } from "react";
import ProductList from "./ProductList";
import Cart from "./Cart";
import Checkout from "./Checkout";
import Login from "./Login";
import "./App.css";

// Use environment variable for API URL, fallback to localhost for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage on initial render
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });
  const [currentPage, setCurrentPage] = useState("products");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user is already logged in
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('currentUser') || '';
  });

  // Fetch products on mount
  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

  // Sync cart from localStorage when navigating to cart page
  useEffect(() => {
    if (currentPage === 'cart') {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          // Force update to ensure cart is synced when viewing cart page
          setCart(parsedCart);
        }
      } catch (error) {
        console.error("Error syncing cart from localStorage:", error);
      }
    }
  }, [currentPage]);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleLogin = (username) => {
    setIsAuthenticated(true);
    setCurrentUser(username);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUser', username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser('');
    setCart([]);
    setCurrentPage('products');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cart');
  };

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="logo" onClick={() => setCurrentPage("products")}>
            🛒 Codemify Store
          </h1>
          <nav className="nav">
            <button 
              className={`nav-link ${currentPage === "products" ? "active" : ""}`}
              onClick={() => setCurrentPage("products")}
            >
              Products
            </button>
            <button 
              className={`nav-link ${currentPage === "cart" ? "active" : ""}`}
              onClick={() => setCurrentPage("cart")}
            >
              Cart
              {getTotalItems() > 0 && (
                <span className="cart-badge">{getTotalItems()}</span>
              )}
            </button>
            <button 
              className="nav-link logout-button"
              onClick={handleLogout}
              title={`Logged in as ${currentUser}`}
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {currentPage === "products" && (
          <ProductList products={products} onAdd={addToCart} />
        )}
        {currentPage === "cart" && (
          <Cart 
            cart={cart} 
            onRemove={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onCheckout={() => setCurrentPage("checkout")}
            onContinueShopping={() => setCurrentPage("products")}
            totalPrice={getTotalPrice()}
          />
        )}
        {currentPage === "checkout" && (
          <Checkout 
            cart={cart}
            totalPrice={getTotalPrice()}
            onComplete={() => {
              clearCart();
              setCurrentPage("products");
            }}
            onCancel={() => setCurrentPage("cart")}
          />
        )}
      </main>

      <footer className="footer">
        <p>© 2025 Codemify Store - Demo Application for Testing</p>
      </footer>
    </div>
  );
};

export default App;
