import axios from 'axios';

const API = axios.create({ baseURL: 'https://filmfind-api.onrender.com' });


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
// Add to Favorites
export const addToFavorites = (data) => API.post('/favorites/add', data);
export const getFavorites = (email) => API.get(`/favorites/${email}`);
export const removeFavorite = (data) => API.delete('/favorites/remove', { data });
export const fetchTrailer = (id) => API.get(`/movies/${id}/trailer`);
export const addToWatchlist = (data) => API.post('/watchlist/add', data);
export const getWatchlist = (email) => API.get(`/watchlist/${email}`);
export const removeFromWatchlist = (data) => API.delete('/watchlist/remove', { data });
export default API;