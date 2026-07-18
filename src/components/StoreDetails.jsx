import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchStoreDetails } from '../services/dbApi';
import ComparisonDashboard from './ComparisonDashboard';
import { translations } from '../services/translations';
import { regions } from './RegionSelector';

const StoreDetails = () => {
  const { domain } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // We'll just hardcode region props for this demo, or we could pass them down.
  // For simplicity, we'll use EN region settings.
  const t = translations['EN'];
  const currency = regions.find(r => r.id === 'EN').currency;
  const cartValue = 150;

  useEffect(() => {
    const loadStoreData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchStoreDetails(domain);
        setStoreData(data);
      } catch (err) {
        console.error("Failed to load store data", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (domain) {
      loadStoreData();
    }
  }, [domain]);

  if (isLoading) {
    return (
      <div className="flex-center" style={{ padding: '5rem' }}>
        <div style={{
          width: '50px', height: '50px',
          border: '4px solid var(--border-light)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  if (!storeData) return null;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}>
      
      {/* Back navigation */}
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>← Back to Dashboard</span>
        </Link>
      </div>

      {/* Store Header */}
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', textTransform: 'capitalize' }}>
          {domain.split('.')[0]}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          We found {storeData.stats.totalActiveCodes} active coupons for {domain}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem 2rem', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Success Rate</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-success)' }}>{storeData.stats.averageSuccessRate}%</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem 2rem', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Last Used</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{storeData.stats.lastUsed}</div>
          </div>
        </div>
      </div>

      {/* Coupons Section */}
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Active Coupons</h2>
      <ComparisonDashboard coupons={storeData.coupons} cartValue={cartValue} t={t} currency={currency} />

      {/* Community Comments Section */}
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Community Activity</h2>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          {storeData.comments.map((comment) => (
            <div key={comment.id} style={{ padding: '1rem 0', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {comment.user.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong>{comment.user}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{comment.timestamp}</span>
                </div>
                <p style={{ margin: '0 0 0.5rem 0' }}>{comment.text}</p>
                <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  Used code: <strong>{comment.couponCode}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default StoreDetails;
