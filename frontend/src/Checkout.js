import React, { useState } from "react";

const Checkout = ({ cart, totalPrice, onComplete, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    // Simulate order processing
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="checkout-container">
        <div className="success-message">
          <h3>✅ Order Placed Successfully!</h3>
          <p>Thank you for your purchase. Your order has been confirmed.</p>
          <p>Order Total: <strong>${totalPrice}</strong></p>
          <button className="btn-primary" onClick={onComplete}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h2>Checkout</h2>
      </div>

      <div className="order-summary">
        <h3>Order Summary</h3>
        {cart.map(item => (
          <div key={item.id} className="summary-item">
            <span>{item.name} × {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="summary-total">
          <span>Total:</span>
          <span>${totalPrice}</span>
        </div>
      </div>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <h3>Shipping Information</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              data-testid="first-name-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              data-testid="last-name-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            data-testid="email-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address *</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            data-testid="address-input"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              data-testid="city-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="state">State *</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              data-testid="state-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="zipCode">Zip Code *</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            required
            pattern="[0-9]{5}"
            data-testid="zip-code-input"
          />
        </div>

        <h3 style={{ marginTop: "2rem" }}>Payment Information</h3>

        <div className="form-group">
          <label htmlFor="cardNumber">Card Number *</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            required
            pattern="[0-9]{16}"
            placeholder="1234567890123456"
            data-testid="card-number-input"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date *</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
              placeholder="MM/YY"
              pattern="[0-9]{2}/[0-9]{2}"
              data-testid="expiry-date-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="cvv">CVV *</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              required
              pattern="[0-9]{3,4}"
              placeholder="123"
              data-testid="cvv-input"
            />
          </div>
        </div>

        <div className="checkout-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" data-testid="complete-order-button">
            Complete Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
