import React, { useState } from 'react';

const Checkout = () => {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState('');

  const cartItems = [
    { id: 1, name: 'Wireless Noise-Cancelling Headphones', price: 150 },
    { id: 2, name: 'Ergonomic Desk Chair', price: 200 }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax - discount;

  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    if (code === 'SAVE20') {
      const savings = subtotal * 0.2;
      setDiscount(savings);
      setMessage(`Success! 20% off applied. Saved £${savings.toFixed(2)}`);
    } else if (code === 'MINUS10') {
      setDiscount(10);
      setMessage(`Success! £10 off applied.`);
    } else if (code === 'FREESHIP') {
      setDiscount(5); // Simulate free shipping savings
      setMessage(`Success! Free shipping applied.`);
    } else {
      setDiscount(0);
      setMessage('Invalid or expired promo code.');
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>Secure Checkout</h2>
      
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Cart Items */}
        <div style={{ flex: '1 1 400px' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Your Cart</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cartItems.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                <span>{item.name}</span>
                <strong>£{item.price.toFixed(2)}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ flex: '1 1 300px', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Order Summary</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Subtotal</span>
            <span>£{subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Tax (10%)</span>
            <span>£{tax.toFixed(2)}</span>
          </div>
          
          {discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-success)' }}>
              <span>Discount</span>
              <span>-£{discount.toFixed(2)}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)', fontSize: '1.25rem', fontWeight: 800 }}>
            <span>Total</span>
            <span id="checkout-total">£{total.toFixed(2)}</span>
          </div>

          {/* Promo Code Input */}
          <div style={{ marginTop: '2rem' }}>
            <label htmlFor="promo-code" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Gift card or discount code</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                id="promo-code" 
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter code" 
                style={{ padding: '0.75rem', fontSize: '1rem' }}
              />
              <button 
                id="apply-promo"
                onClick={handleApplyPromo}
                style={{ background: 'var(--color-primary)', color: 'white', padding: '0 1rem', borderRadius: '999px', fontWeight: 600 }}
              >
                Apply
              </button>
            </div>
            {message && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: discount > 0 ? 'var(--text-success)' : 'var(--color-accent)' }}>
                {message}
              </p>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Checkout;
