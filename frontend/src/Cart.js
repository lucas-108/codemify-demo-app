import React from "react";

const Cart = ({ cart, onRemove, onUpdateQuantity, onCheckout, onContinueShopping, totalPrice }) => (
  <div className="cart-container">
    <div className="cart-header">
      <h2>Your Shopping Cart</h2>
    </div>
    
    {cart.length === 0 ? (
      <div className="empty-cart">
        <p>Your cart is empty</p>
        <button className="btn-primary" onClick={onContinueShopping}>
          Continue Shopping
        </button>
      </div>
    ) : (
      <>
        <ul className="cart-items">
          {cart.map(item => (
            <li key={item.id} className="cart-item">
              <img 
                src={item.image} 
                alt={item.name} 
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.name}</h3>
                <p className="cart-item-description">{item.description}</p>
                <span className="cart-item-price">
                  ${item.price} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
              <div className="cart-item-actions">
                <div className="quantity-controls">
                  <button 
                    className="btn-quantity"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    data-testid={`decrease-quantity-${item.id}`}
                  >
                    −
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button 
                    className="btn-quantity"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    data-testid={`increase-quantity-${item.id}`}
                  >
                    +
                  </button>
                </div>
                <button 
                  className="btn-remove"
                  onClick={() => onRemove(item.id)}
                  data-testid={`remove-from-cart-${item.id}`}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        
        <div className="cart-summary">
          <div className="cart-total">
            <span>Total:</span>
            <span>${totalPrice}</span>
          </div>
          <div className="cart-actions">
            <button className="btn-secondary" onClick={onContinueShopping}>
              Continue Shopping
            </button>
            <button 
              className="btn-primary" 
              onClick={onCheckout}
              data-testid="checkout-button"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </>
    )}
  </div>
);

export default Cart;
