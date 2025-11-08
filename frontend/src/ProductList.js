import React from "react";

const ProductList = ({ products, onAdd }) => (
  <div className="products-container">
    <div className="products-header">
      <h2>Products</h2>
      <span className="products-count">{products.length} items</span>
    </div>
    <ul className="products-grid">
      {products.map(product => (
        <li key={product.id} className="product-card">
          <img 
            src={product.image} 
            alt={product.name} 
            className="product-image"
          />
          <div className="product-info">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-description">{product.description}</p>
            <div className="product-footer">
              <span className="product-price">${product.price}</span>
              <button 
                className="btn-add"
                onClick={() => onAdd(product)}
                data-testid={`add-to-cart-${product.id}`}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default ProductList;
