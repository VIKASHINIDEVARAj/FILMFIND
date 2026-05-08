import { useState, useEffect , useRef } from 'react';
import { searchMovies } from '../api'; 

const Header = ({ onSearch, onClear, onSignInClick, user, onLogout, onFavClick, onHomeClick, onWatchlistClick, currentView , isSearching}) => {
  const [query, setQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecents, setShowRecents] = useState(false);
  
  // LIVE SUGGESTIONS STATE 👇
  const [suggestions, setSuggestions] = useState([]);
  const menuRef = useRef(null); // Menu track 

  // ✨ SDE MAGIC: Click Outside Listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setDropdownOpen(false); // Veliya click panna close pannidu
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('filmfind_recents')) || [];
    setRecentSearches(saved);
  }, []);

  // SDE CONCEPT: DEBOUNCED API CALL FOR LIVE SEARCH 👇
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length > 1) {
        try {
          const { data } = await searchMovies(query);
          setSuggestions(data.slice(0, 5)); // Top 5 related movies
        } catch (err) { console.error(err); }
      } else {
        setSuggestions([]);
      }
    };
    const timeoutId = setTimeout(fetchSuggestions, 300); // 300ms wait
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      const updated = [query, ...recentSearches.filter(q => q !== query)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('filmfind_recents', JSON.stringify(updated));
      setShowRecents(false);
    }
  };

  const handleSuggestionClick = (movieTitle) => {
    setQuery(movieTitle);
    onSearch(movieTitle);
    setShowRecents(false);
  };

  const toggleTheme = () => {
    document.body.classList.toggle('light-mode');
    setIsLightMode(!isLightMode);
  };

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {(currentView !== 'home' || query !== '' || isSearching) && (
          <button onClick={() => { setQuery(''); onClear(); onHomeClick(); }} className="back-btn" title="Go Back">⬅️</button>
        )}
        <div className="logo" onClick={() => { setQuery(''); onClear(); onHomeClick(); }} style={{ cursor: 'pointer' }}>
          FilmFind<span style={{ color: '#e50914' }}>.</span>
        </div>
      </div>
      
      <div className="header-right">
        <div className="search-container" style={{ position: 'relative' }}>
          <form className="search-form" onSubmit={handleSearch}>
            <input 
              type="text" placeholder="Search movies..." value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              onFocus={() => setShowRecents(true)}
              onBlur={() => setShowRecents(false)} /* Removed setTimeout */
              className="search-input" 
            />
            <button type="submit" className="search-btn">🔍</button>
          </form>

          {/* THE NEW LIVE SUGGESTIONS DROPDOWN 👇 */}
          {showRecents && (
            <div className="recent-searches-dropdown">
              {query.trim().length > 1 ? (
                suggestions.length > 0 ? (
                  <>
                    <p className="dropdown-label">Related Movies</p>
                    {suggestions.map((movie) => (
                      <div key={movie.id} className="recent-item" onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(movie.title); }}>
                        🎬 {movie.title}
                      </div>
                    ))}
                  </>
                ) : <p className="dropdown-label">No matches found...</p>
              ) : (
                recentSearches.length > 0 && (
                  <>
                    <p className="dropdown-label">Recent Searches</p>
                    {recentSearches.map((item, idx) => (
                      <div key={idx} className="recent-item" onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(item); }}>
                        🕒 {item}
                      </div>
                    ))}
                  </>
                )
              )}
            </div>
          )}
        </div>

        {user ? (
          <div className="profile-menu" ref={menuRef}> 
            <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme">{isLightMode ? '🌙' : '☀️'}</button>
            <span className="profile-name">Hi, {user.name}</span>
            <button className="kebab-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>⋮</button>

            

            {dropdownOpen && (
              <div className="profile-dropdown">
                <ul>
                  <li onClick={() => { onWatchlistClick(); setDropdownOpen(false); }}>Watchlist ⏳</li>
                  <li onClick={() => { onFavClick(); setDropdownOpen(false); }}>My Favorites ✅</li>
                  <li className="divider"></li>
                  <li onClick={onLogout} className="logout-item">Logout</li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <button className="signin-btn" onClick={onSignInClick}>Sign In</button>
        )}
      </div>
    </header>
  );
};

export default Header;