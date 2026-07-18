import React, { useState, useEffect } from 'react';

const AutoApplyWidget = () => {
  const [status, setStatus] = useState('idle');
  const [testedCount, setTestedCount] = useState(0);
  const [savedAmount, setSavedAmount] = useState(0);
  const totalCoupons = 4; // We will test 4 mock codes

  const handleApply = async () => {
    setStatus('testing');
    
    const codesToTest = ['INVALID', 'FREESHIP', 'MINUS10', 'SAVE20'];
    let bestCode = null;
    let maxSavings = 0;
    
    const promoInput = document.getElementById('promo-code');
    const applyButton = document.getElementById('apply-promo');
    const totalElement = document.getElementById('checkout-total');
    
    if (!promoInput || !applyButton || !totalElement) {
      setStatus('done');
      return;
    }
    
    const originalTotal = parseFloat(totalElement.innerText.replace(/[^0-9.]/g, '')) || 0;
    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    for (let i = 0; i < codesToTest.length; i++) {
      const code = codesToTest[i];
      setTestedCount(i + 1);
      
      // React 16+ requires bypassing the wrapper to trigger onChange events from outside
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      nativeInputValueSetter.call(promoInput, code);
      promoInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      await delay(400); // Simulate typing wait
      applyButton.click();
      await delay(600); // Wait for recalculation
      
      const newTotal = parseFloat(totalElement.innerText.replace(/[^0-9.]/g, '')) || 0;
      const savings = originalTotal - newTotal;
      
      if (savings > maxSavings) {
        maxSavings = savings;
        bestCode = code;
      }
    }
    
    // Apply the best code found
    if (bestCode) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      nativeInputValueSetter.call(promoInput, bestCode);
      promoInput.dispatchEvent(new Event('input', { bubbles: true }));
      applyButton.click();
    }

    setSavedAmount(maxSavings);
    setStatus('done');
  };

  const handleClose = () => {
    const root = document.getElementById('couponpal-extension-root');
    if (root) {
      root.remove();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '320px',
      background: 'rgba(30, 41, 59, 0.95)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      padding: '1.5rem',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      zIndex: 999999,
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .btn-gradient {
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 999px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          transition: transform 0.2s;
        }
        .btn-gradient:hover {
          transform: translateY(-2px);
        }
        .close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 1.2rem;
          line-height: 1;
        }
        .close-btn:hover {
          color: white;
        }
      `}</style>
      
      <button onClick={handleClose} className="close-btn">&times;</button>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
        <img 
          src={chrome.runtime ? chrome.runtime.getURL("logo.png") : "/logo.png"} 
          alt="Logo" 
          style={{ width: '40px', height: '40px', borderRadius: '8px' }} 
        />
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>CouponPal</h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Found {totalCoupons} codes for this site</p>
        </div>
      </div>

      {status === 'idle' && (
        <button onClick={handleApply} className="btn-gradient">
          Auto-Apply Codes
        </button>
      )}

      {status === 'testing' && (
        <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
          <p style={{ margin: '0 0 10px 0', fontWeight: 600 }}>Testing code {testedCount} of {totalCoupons}...</p>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              width: `${(testedCount / totalCoupons) * 100}%`, 
              background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>
      )}

      {status === 'done' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            color: '#10b981', 
            fontSize: '1.5rem', 
            fontWeight: 800, 
            marginBottom: '0.5rem' 
          }}>
            {savedAmount > 0 ? `You saved £${savedAmount.toFixed(2)}!` : 'No working codes found.'}
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>
            {savedAmount > 0 ? 'Best code automatically applied to cart.' : 'We tried our best!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AutoApplyWidget;
