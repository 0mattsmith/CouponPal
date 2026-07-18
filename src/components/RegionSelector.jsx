import React, { useState, useRef, useEffect } from 'react';

export const regions = [
  { id: 'EN', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', currency: '£', flagUrl: 'https://flagcdn.com/w160/gb-eng.png' },
  { id: 'US', name: 'United States', flag: '🇺🇸', currency: '$', flagUrl: 'https://flagcdn.com/w160/us.png' },
  { id: 'DE', name: 'Germany', flag: '🇩🇪', currency: '€', flagUrl: 'https://flagcdn.com/w160/de.png' },
  { id: 'FR', name: 'France', flag: '🇫🇷', currency: '€', flagUrl: 'https://flagcdn.com/w160/fr.png' },
  { id: 'IT', name: 'Italy', flag: '🇮🇹', currency: '€', flagUrl: 'https://flagcdn.com/w160/it.png' },
  { id: 'RU', name: 'Russia', flag: '🇷🇺', currency: '₽', flagUrl: 'https://flagcdn.com/w160/ru.png' }
];

const RegionSelector = ({ currentRegion, onRegionChange, useLocalLanguage, setUseLocalLanguage, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeRegion = regions.find(r => r.id === currentRegion) || regions[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 50 }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '0.5rem 1rem',
          borderRadius: '999px',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          cursor: 'pointer',
          border: '1px solid var(--border-light)'
        }}
      >
        <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{activeRegion.flag}</span>
      </button>

      {isOpen && (
        <div 
          className="glass-panel animate-fade-in"
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '0.5rem',
            width: 'max-content',
            minWidth: '220px',
            padding: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))'
          }}
        >
          {regions.map(region => (
            <button
              key={region.id}
              onClick={() => {
                onRegionChange(region.id);
                setIsOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0.75rem',
                borderRadius: '8px',
                background: currentRegion === region.id ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
                textAlign: 'left',
                color: 'var(--text-main)',
                transition: 'all var(--transition-fast)',
                transform: 'translateX(0px)'
              }}
              onMouseOver={(e) => {
                if (currentRegion !== region.id) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateX(6px)';
                }
              }}
              onMouseOut={(e) => {
                if (currentRegion !== region.id) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0px)';
                }
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{region.flag}</span>
              <span style={{ 
                fontWeight: 900, 
                backgroundImage: `url(${region.flagUrl})`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitTextFillColor: 'transparent'
              }}>
                {region.name}
              </span>
            </button>
          ))}
          
          <div style={{
            marginTop: '0.5rem',
            paddingTop: '0.5rem',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.5rem 0.25rem',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.9rem'
          }}>
            <input 
              type="checkbox" 
              id="local-lang" 
              checked={useLocalLanguage}
              onChange={(e) => setUseLocalLanguage(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <label htmlFor="local-lang" style={{ cursor: 'pointer', userSelect: 'none' }}>
              {t.localLanguage}
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionSelector;
