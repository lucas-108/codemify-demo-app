import React from "react";

const ProductList = ({ products, onAdd }) => {
  const handleImageError = (e) => {
    // Fallback to a different placeholder service or a solid color div
    e.target.style.display = 'none';
    const fallback = e.target.nextElementSibling;
    if (fallback && fallback.classList.contains('image-fallback')) {
      fallback.style.display = 'flex';
    }
  };

  const createFallbackImage = (product) => {
    const colors = ['#FFD700', '#4A90E2', '#E74C3C', '#95A5A6', '#2C3E50', '#E67E22'];
    const color = colors[product.id % colors.length];
    return (
      <div 
        className="image-fallback product-image"
        style={{
          backgroundColor: color,
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '1rem'
        }}
      >
        {product.name}
      </div>
    );
  };

  return (
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
              onError={handleImageError}
            />
            {createFallbackImage(product)}
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-footer">
                <span className="product-price">${product.price}</span>
                <button 
                  className="btn-add"
                  onClick={() => product.id === 1 ? null : onAdd(product)}
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
};

export default ProductList;
