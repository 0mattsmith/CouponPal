import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onSearch, isLoading, t }) => {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      navigate(`/store/${url.trim().toLowerCase()}`);
    }
  };

  return (
    <div className="search-bar-container" style={{ width: '100%', maxWidth: '600px', margin: '0 auto', marginBottom: '2rem' }}>
      <form onSubmit={handleSubmit} style={{ position: 'relative', display: 'flex', gap: '10px' }}>
        <input
          type="url"
          placeholder={t ? t.enterWebsite : "Enter website URL (e.g., asos.com)"}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={{ flex: 1 }}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="btn-primary"
          disabled={isLoading}
          style={{ padding: '0 2rem', whiteSpace: 'nowrap' }}
        >
          {isLoading ? (t ? t.searching : 'Searching...') : (t ? t.findCoupons : 'Find Coupons')}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
