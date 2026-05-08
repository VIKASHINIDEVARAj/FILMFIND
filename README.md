# 🎬 FilmFind - Full Stack Movie Discovery Platform

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

A highly responsive, Netflix-inspired movie discovery application built using the MERN stack. FilmFind allows users to explore trending movies, search by genres, watch trailers, and manage their personal watchlists and favorites.

🔗 **Live Demo:** [Insert Your Vercel Link Here]

## ✨ Key Features

* **🔐 Secure Authentication:** JWT-based user login and registration with a seamless UI and password visibility toggle.
* **🎥 TMDB API Integration:** Fetches real-time trending movies, high-quality posters, and official YouTube trailers.
* **🎭 Dynamic Genre Filtering:** Smart filtering system allowing users to browse movies by specific genres (Action, Comedy, Horror, etc.) directly from the home screen.
* **🧠 Smart Caching (Recently Viewed):** Utilizes Browser `LocalStorage` to remember and display users' recently viewed movies without making redundant database calls, optimizing performance.
* **🍿 Similar Movies Recommendation:** Suggests related movies based on the user's current selection to enhance content discovery.
* **📚 Personal Library:** Authenticated users can add movies to their **Favorites** and **Watchlist**, stored securely in MongoDB.
* **💳 Premium Simulation:** A mock paywall UI for premium downloads to demonstrate complex modal management.

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* Custom CSS (Responsive Flexbox/Grid layouts)
* Axios (API calls)

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose
* JSON Web Tokens (JWT) & Bcrypt (Security)

**External APIs:**
* [TMDB API](https://developer.themoviedb.org/docs) (Movie Data & Trailers)

## 🚀 Run Locally

**1. Clone the repository:**
```bash
git clone
Frontend: https://github.com/VIKASHINIDEVARAj/FILMFIND.git
Backend:


2. Setup Backend:

Bash
cd backend
npm install
# Create a .env file and add PORT, MONGO_URI, JWT_SECRET, TMDB_API_KEY
npm start


3. Setup Frontend:

Bash
cd frontend
npm install
# Create a .env file and add VITE_API_KEY
npm run dev

👨‍💻 Author
Developed by Vikashini * GitHub: @VIKASHINIDEVARAj

