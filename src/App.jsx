import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import ComparisonDashboard from './components/ComparisonDashboard';
import CategoryGrid from './components/CategoryGrid';
import RegionSelector, { regions } from './components/RegionSelector';
import { fetchCoupons } from './services/mockApi';
import { translations } from './services/translations';
import { Routes, Route, Link } from 'react-router-dom';
import Checkout from './components/Checkout';
import StoreDetails from './components/StoreDetails';
import './index.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [coupons, setCoupons] = useState(null);
  const [currentDomain, setCurrentDomain] = useState('');
  const [region, setRegion] = useState('EN');
  const [useLocalLanguage, setUseLocalLanguage] = useState(false);
  
  const activeLang = useLocalLanguage ? region : 'EN';
  const t = translations[activeLang] || translations['EN'];
  const activeRegionObj = regions.find(r => r.id === region) || regions[0];
  const currency = activeRegionObj.currency;
  
  const cartValue = 150; // Mock average cart value for calculation

  const handleSearch = async (domain) => {
    setIsLoading(true);
    setCurrentDomain(domain);
    setCoupons(null); // Reset before new search
    
    try {
      const results = await fetchCoupons(domain);
      setCoupons(results);
    } catch (error) {
      console.error("Failed to fetch coupons", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ position: 'relative' }}>
      <RegionSelector 
        currentRegion={region} 
        onRegionChange={setRegion} 
        useLocalLanguage={useLocalLanguage}
        setUseLocalLanguage={setUseLocalLanguage}
        t={t}
      />
      
      <header style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '2rem' }}>
        <Link to="/">
          <img src="./logo.png" alt="CouponPal Logo" style={{ height: '180px', marginBottom: '1rem' }} />
        </Link>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
          {t.description}
        </p>
        <div className="hide-on-mobile" style={{ marginTop: '1rem' }}>
          <Link to="/checkout" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
            Test Extension on Mock Checkout
          </Link>
        </div>
      </header>

      <Routes>
        <Route path="/" element={

      <main>
        <SearchBar onSearch={handleSearch} isLoading={isLoading} t={t} />
        
        {isLoading && (
          <div className="flex-center" style={{ padding: '3rem' }}>
            <div style={{
              width: '40px', height: '40px',
              border: '3px solid var(--border-light)',
              borderTopColor: 'var(--color-primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {!isLoading && coupons && (
          <div className="animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span style={{ 
                background: 'rgba(16, 185, 129, 0.1)', 
                color: 'var(--text-success)',
                padding: '0.5rem 1rem',
                borderRadius: '999px',
                fontSize: '0.875rem',
                fontWeight: 'bold'
              }}>
                {t.foundCodes.replace('{count}', coupons.length).replace('{domain}', currentDomain)}
              </span>
            </div>
            
            <ComparisonDashboard coupons={coupons} cartValue={cartValue} t={t} currency={currency} />
          </div>
        )}

        {!isLoading && coupons && coupons.length === 0 && (
          <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
            <h3 style={{ color: 'var(--text-muted)' }}>{t.noCoupons.replace('{domain}', currentDomain)}</h3>
            <p style={{ color: 'var(--text-muted)' }}>{t.trySearching.replace('{example1}', 'asos.com').replace('{example2}', 'argos.co.uk')}</p>
          </div>
        )}

        {/* Show categories only when not loading and no coupons are displayed */}
        {!isLoading && !coupons && (
          <CategoryGrid onCategoryClick={handleSearch} region={region} t={t} />
        )}
          </main>
        } />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/store/:domain" element={<StoreDetails />} />
      </Routes>
    </div>
  );
}

export default App;
