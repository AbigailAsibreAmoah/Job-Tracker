import React, { useState } from 'react';

const URLInput = ({ onJobDataExtracted }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleParse = async () => {
    if (!url) return;
    
    setLoading(true);
    try {
      await onJobDataExtracted(url);
      setUrl('');
    } catch (error) {
      alert('Failed to parse URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="url-input-container">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste job URL (LinkedIn, Indeed, Glassdoor...)"
        className="url-input"
        disabled={loading}
      />
      <button 
        onClick={handleParse} 
        className="btn-parse"
        disabled={loading || !url}
      >
        {loading ? 'Parsing...' : 'Auto-Fill from URL'}
      </button>
    </div>
  );
};

export default URLInput;
