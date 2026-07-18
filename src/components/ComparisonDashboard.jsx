import React from 'react';
import CouponCard from './CouponCard';
import { calculateSavings } from '../services/mockApi';

const ComparisonDashboard = ({ coupons, cartValue, t, currency }) => {
  if (!coupons || coupons.length === 0) return null;

  // Calculate savings and sort by highest savings
  const sortedCoupons = [...coupons].map(coupon => ({
    ...coupon,
    estimatedSavings: calculateSavings(coupon, cartValue)
  })).sort((a, b) => b.estimatedSavings - a.estimatedSavings);

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{t ? t.availableCodes : 'Available Codes'}</h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {t ? t.calculatedFor.replace('{currency}', currency).replace('{cartValue}', cartValue) : `Calculated for ~${currency}${cartValue} cart`}
        </span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {sortedCoupons.map((coupon, index) => (
          <CouponCard 
            key={coupon.id} 
            coupon={coupon} 
            estimatedSavings={coupon.estimatedSavings}
            isBest={index === 0}
            t={t}
            currency={currency}
          />
        ))}
      </div>
    </div>
  );
};

export default ComparisonDashboard;
