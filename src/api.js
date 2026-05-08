import axios from 'axios';

const API = axios.create({ baseURL: 'https://filmfind-api.onrender.com/api' });


export const setAuthToken = (token) => {
    if (token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete API.defaults.headers.common['Authorization'];
    }
};

export const fetchTrending = () => API.get('/movies/trending');
export const searchMovies = (query) => API.get(`/movies/search?query=${query}`);
export const loginUser = (formData) => API.post('/auth/login', formData);
export const registerUser = (formData) => API.post('/auth/register', formData);
export const addToFavorites = (data) => API.post('/favorites/add', data);
export const getFavorites = (email) => API.get(`/favorites/${email}`);
export const removeFavorite = (data) => API.delete('/favorites/remove', { data });
export const fetchTrailer = (id) => API.get(`/movies/${id}/trailer`);
export const addToWatchlist = (data) => API.post('/watchlist/add', data);
export const getWatchlist = (email) => API.get(`/watchlist/${email}`);
export const removeFromWatchlist = (data) => API.delete('/watchlist/remove', { data });

export const fetchMoviesByGenre = (genreId) => {
    const API_KEY = import.meta.env.VITE_API_KEY; // Vercel-la potta key
    return axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`);
};
export const fetchSimilarMovies = (movieId) => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    return axios.get(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${API_KEY}`);
};
export default API;