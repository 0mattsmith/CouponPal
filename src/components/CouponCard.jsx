import React, { useState } from 'react';

const CouponCard = ({ coupon, estimatedSavings, isBest, t, currency }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="glass-panel animate-fade-in" 
      style={{ 
        padding: '1.5rem', 
        marginBottom: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'relative',
        border: isBest ? '1px solid var(--color-primary)' : '1px solid var(--border-light)',
        boxShadow: isBest ? 'var(--shadow-glow)' : 'var(--shadow-card)'
      }}
    >
      {isBest && (
        <span style={{
          position: 'absolute',
          top: '-12px',
          right: '20px',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
          color: 'white',
          padding: '4px 12px',
          borderRadius: '999px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>
          {t ? t.highestSavings : 'Highest Savings'}
        </span>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.25rem 0' }} className="text-gradient">
            {coupon.discountType === 'percentage' ? `${coupon.discountValue}% ${t ? t.off : 'OFF'}` : `${currency}${coupon.discountValue} ${t ? t.off : 'OFF'}`}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{coupon.description}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: 'var(--text-success)', fontWeight: 'bold', fontSize: '1.25rem', margin: 0 }}>
            ~{currency}{estimatedSavings.toFixed(2)}
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t ? t.estSavings : 'est. savings'}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <div style={{ 
          background: 'rgba(0,0,0,0.2)', 
          padding: '0.5rem 1rem', 
          borderRadius: '6px',
          fontFamily: 'monospace',
          fontSize: '1.1rem',
          letterSpacing: '1px',
          border: '1px dashed var(--color-primary)'
        }}>
          {coupon.code}
        </div>
        <button 
          onClick={handleCopy} 
          className="btn-primary"
          style={{ 
            background: copied ? 'var(--text-success)' : '',
            boxShadow: copied ? 'none' : ''
          }}
        >
          {copied ? (t ? t.copied : 'Copied!') : (t ? t.copyCode : 'Copy Code')}
        </button>
      </div>
      
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '10px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ 
            width: '8px', height: '8px', borderRadius: '50%', 
            background: coupon.successRate > 80 ? 'var(--text-success)' : 'var(--color-accent)'
          }}></span>
          {coupon.successRate}% {t ? t.success : 'Success'}
        </span>
        <span>•</span>
        <span>{t ? t.verifiedToday : 'Verified Today'}</span>
      </div>
    </div>
  );
};

export default CouponCard;
