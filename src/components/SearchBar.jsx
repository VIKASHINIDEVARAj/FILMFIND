import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
 
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent Page refresh 
    if (searchTerm.trim() !== '') {
      onSearch(searchTerm); 
    }
  };

  return (
    <div className="search-container">
      {/* Even entering a single word should trigger the search, so no need for a separate button. */}
      <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <input
          type="text"
          id="search-input"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" id="search-btn">Search</button>
      </form>
    </div>
  );
};

export default SearchBar;