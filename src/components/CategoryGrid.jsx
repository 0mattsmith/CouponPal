import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../services/dbApi';

const CategoryGrid = ({ onCategoryClick, region, t }) => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories(region);
      setCategories(data);
    };
    loadCategories();
  }, [region]);

  const handleCategorySiteClick = (site) => {
    navigate(`/store/${site}`);
  };

  const getTranslatedCategoryName = (name) => {
    if (!t) return name;
    switch (name) {
      case 'Sports & Outdoors': return t.catSports || name;
      case 'Home & Furniture': return t.catHome || name;
      case 'Groceries': return t.catGroceries || name;
      case 'Electronics': return t.catElectronics || name;
      default: return name;
    }
  };

  return (
    <div style={{ marginTop: '3rem', width: '100%', maxWidth: '800px', margin: '3rem auto 0' }}>
      <h3 style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 500 }}>
        {t ? t.browseByCategory : 'Browse by Category'}
      </h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '1rem' 
      }}>
        {categories.map((category) => (
          <div 
            key={category.name} 
            className="glass-panel" 
            style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h4 style={{ color: 'var(--color-primary)', fontSize: '1.1rem', margin: '0 0 1rem 0' }}>
              {getTranslatedCategoryName(category.name)}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {category.sites.map(site => (
                <button
                  key={site}
                  onClick={() => handleCategorySiteClick(site)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-main)',
                    textAlign: 'left',
                    padding: '0.25rem 0',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'color var(--transition-fast)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-secondary)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-main)'}
                >
                  {site}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
