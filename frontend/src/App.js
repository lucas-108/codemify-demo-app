import React, { useState, useEffect } from "react";
import ProductList from "./ProductList";
import Cart from "./Cart";
import Checkout from "./Checkout";
import "./App.css";

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState("products");

  useEffect(() => {
    fetch("http://localhost:4000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

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
