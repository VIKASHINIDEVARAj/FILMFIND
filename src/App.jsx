import { useEffect, useState } from 'react';
import { fetchTrending, searchMovies, addToFavorites, getFavorites, removeFavorite, fetchTrailer, addToWatchlist, getWatchlist, removeFromWatchlist } from './api'; 
import Header from './components/Header';
import Auth from './components/Auth';
import './App.css';

function App() {
  const [trending, setTrending] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);

  const [currentView, setCurrentView] = useState('home'); // 'home', 'favorites', 'watchlist'
  const [myFavs, setMyFavs] = useState([]);
  const [myWatchlist, setMyWatchlist] = useState([]);
  
  const [isAdded, setIsAdded] = useState(false); 
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  // PREMIUM PAYMENT MODAL STATE
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    fetchTrending().then(res => setTrending(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (user) {
      getFavorites(user.email).then(res => setMyFavs(res.data)).catch(console.error);
      getWatchlist(user.email).then(res => setMyWatchlist(res.data)).catch(console.error);
    } else {
      setMyFavs([]); setMyWatchlist([]);
    }
  }, [user]);

  const handleSearch = async (query) => {
    try {
      const { data } = await searchMovies(query);
      setSearchResults(data); setIsSearching(true); setCurrentView('home'); 
    } catch (err) { console.error(err); }
  };

  const clearSearch = () => { setIsSearching(false); setSearchResults([]); };

  const handleLogout = () => { localStorage.removeItem('token'); setUser(null); setCurrentView('home'); };

  const loadFavorites = () => { setCurrentView('favorites'); clearSearch(); };
  
  // PUDHUSA ADD PANNIRUKEN - Watchlist load panna
  const loadWatchlist = () => { setCurrentView('watchlist'); clearSearch(); };

  const handleFavoriteToggle = async () => {
    if (!user) return alert("Please login!");
    try {
      if (isAdded) {
        await removeFavorite({ userEmail: user.email, movieId: selectedMovie.id });
        setIsAdded(false); setMyFavs(myFavs.filter(f => f.movie.id !== selectedMovie.id));
      } else {
        await addToFavorites({ userEmail: user.email, movie: selectedMovie });
        setIsAdded(true); setMyFavs([...myFavs, { movie: selectedMovie }]);
      }
    } catch (err) { console.error(err); }
  };

  const handleWatchlistToggle = async () => {
    if (!user) return alert("Please login!");
    try {
      if (isWatchlisted) {
        await removeFromWatchlist({ userEmail: user.email, movieId: selectedMovie.id });
        setIsWatchlisted(false); setMyWatchlist(myWatchlist.filter(w => w.movie.id !== selectedMovie.id));
      } else {
        await addToWatchlist({ userEmail: user.email, movie: selectedMovie });
        setIsWatchlisted(true); setMyWatchlist([...myWatchlist, { movie: selectedMovie }]);
      }
    } catch (err) { console.error(err); }
  };

  const handlePlayTrailer = async () => {
    try {
      const { data } = await fetchTrailer(selectedMovie.id);
      if (data.trailerKey) setTrailerKey(data.trailerKey);
      else alert("Trailer not found! 🤷‍♂️");
    } catch (err) { console.error(err); }
  };

  const openModal = (movie) => {
    setIsAdded(myFavs.some(fav => fav.movie.id === movie.id)); 
    setIsWatchlisted(myWatchlist.some(w => w.movie.id === movie.id));
    setTrailerKey(null); 
    setSelectedMovie(movie);
  };

  if (!user) {
    return (
      <div className="landing-page" style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.6)), url('https://assets.nflxext.com/ffe/siteui/vlv3/a73c4363-1dcd-4719-b3b1-3725418fd91d/fe1147dd-78be-44aa-a0e5-2d2994305a13/IN-en-20231016-popsignuptwoweeks-perspective_alpha_website_large.jpg')`, minHeight: '100vh', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column' }}>
        <header className="navbar" style={{ position: 'relative', background: 'transparent' }}><div className="logo">FilmFind<span style={{ color: '#e50914' }}>.</span></div><button className="signin-btn" onClick={() => setShowAuth(true)}>Sign In</button></header>
        <div className="landing-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '20px', marginTop: '-50px' }}><h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '20px', maxWidth: '800px' }}>Unlimited movies, TV shows and more.</h1><button onClick={() => setShowAuth(true)} style={{ padding: '15px 40px', fontSize: '1.5rem', backgroundColor: '#e50914', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Get Started ❯</button></div>
        {showAuth && <Auth onClose={() => setShowAuth(false)} onLoginSuccess={(u) => { setUser(u); setShowAuth(false); }} />}
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header 
        onSearch={handleSearch} 
        onClear={clearSearch} 
        user={user} 
        onLogout={handleLogout} 
        onFavClick={loadFavorites} 
        onHomeClick={() => setCurrentView('home')} 
        onWatchlistClick={loadWatchlist} 
        currentView={currentView} /* 👈 INTHA OREY ORU VAARTHAIYA LAST LA ADD PANNU */
      />
      
      {/* RENDER VIEWS */}
      {currentView === 'watchlist' ? (
        <div className="search-results-section">
          <h2>My Watchlist ⏳</h2>
          <div className="movie-grid">
            {myWatchlist.length > 0 ? myWatchlist.map((item, i) => (
              item.movie.poster_path && <div key={i} className="grid-movie"><img src={`https://image.tmdb.org/t/p/w300${item.movie.poster_path}`} alt={item.movie.title} onClick={() => openModal(item.movie)} /><p>{item.movie.title}</p></div>
            )) : <p>Watchlist is empty! Add movies to watch later.</p>}
          </div>
        </div>
      ) : currentView === 'favorites' ? (
        <div className="search-results-section">
          <h2>My Favorites 💖</h2>
          <div className="movie-grid">
            {myFavs.length > 0 ? myFavs.map((fav, i) => (
              fav.movie.poster_path && <div key={i} className="grid-movie"><img src={`https://image.tmdb.org/t/p/w300${fav.movie.poster_path}`} alt={fav.movie.title} onClick={() => openModal(fav.movie)} /><p>{fav.movie.title}</p></div>
            )) : <p>Your favorite list is empty!</p>}
          </div>
        </div>
      ) : isSearching ? (
        <div className="search-results-section">
          <h2>Search Results 🍿</h2>
          <div className="movie-grid">
            {searchResults.length > 0 ? searchResults.map(movie => (
              movie.poster_path && <div key={movie.id} className="grid-movie"><img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} onClick={() => openModal(movie)} /><p>{movie.title}</p></div>
            )) : <p>No movies found!</p>}
          </div>
        </div>
      ) : (
        <>
          {trending.length > 0 && (
            <div className="hero" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${trending[0].backdrop_path})` }}>
              <div className="hero-vignette"></div>
              <div className="hero-content">
                <h1 className="hero-title">{trending[0].title}</h1><p className="hero-overview">{trending[0].overview}</p>
                <button className="play-btn" onClick={async () => { openModal(trending[0]); handlePlayTrailer(); }}>▶ Play Trailer</button>
              </div>
            </div>
          )}
          <div className="movie-row"><h2 className="row-title">Trending Now</h2><div className="row-posters">{trending.slice(1, 15).map(movie => (<img key={movie.id} src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} className="row-poster" onClick={() => openModal(movie)} />))}</div></div>
        </>
      )}

      {/* MOVIE DETAILS MODAL */}
      {selectedMovie && (
        <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedMovie(null)}>✖</button>
            {trailerKey ? (
              <div className="video-container" style={{ height: '400px', backgroundColor: '#000' }}><iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`} title="Trailer" frameBorder="0" allowFullScreen></iframe></div>
            ) : (
              <div className="modal-backdrop-container" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path})` }}><div className="modal-vignette"></div></div>
            )}
            
            <div className="modal-info">
              <h2>{selectedMovie.title}</h2>
              <p style={{ marginBottom: '20px' }}>{selectedMovie.overview}</p>
              
              <div className="modal-actions">
                {!trailerKey && <button className="play-btn" onClick={handlePlayTrailer}>▶ Play Trailer</button>}
                
                {/* 🐛 INVISIBLE BUG FIXED 👇 */}
                <button 
                  className="fav-btn" 
                  onClick={handleFavoriteToggle} 
                  style={isAdded ? { borderColor: '#e50914', color: '#e50914' } : {}}
                >
                  {isAdded ? " Liked" : "➕ Favorite"}
                </button>
                
                <button 
                  className="fav-btn" 
                  onClick={handleWatchlistToggle} 
                  style={isWatchlisted ? { borderColor: '#ffd700', color: '#ffd700' } : {}}
                >
                  {isWatchlisted ? "⏳ In Watchlist" : "🕒 Watch Later"}
                </button>
                
                <button className="fav-btn" onClick={() => setShowPayment(true)}>
                  📥 Download (Premium)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* THE PREMIUM PAYMENT PAYWALL UI */}
      {showPayment && (
        <div className="modal-overlay" style={{ zIndex: 3000 }} onClick={() => setShowPayment(false)}>
          <div className="auth-box" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center', background: '#f6f9fc', color: '#32325d', borderRadius: '8px', padding: '40px 30px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>FilmFind <span style={{ color: '#e50914' }}>PREMIUM</span> 💎</h2>
            <p style={{ marginBottom: '30px', color: '#525f7f', fontSize: '1.1rem' }}>Download high-quality movies and watch offline. Upgrade to Premium for just <strong>₹99/month</strong>.</p>
            
            <button 
              onClick={() => { alert("Payment Simulated! Movie downloading... 📥"); setShowPayment(false); }} 
              style={{ background: '#6772E5', color: '#fff', padding: '15px', border: 'none', borderRadius: '4px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', width: '100%', marginBottom: '15px', boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11)' }}
            >
              Pay with Stripe
            </button>
            
            <button onClick={() => setShowPayment(false)} style={{ background: 'transparent', color: '#aab7c4', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;