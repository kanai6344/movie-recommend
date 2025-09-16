// Movie database
const movies = [
    {
        title: "Inception",
        year: 2010,
        rating: 8.8,
        genres: ["Action", "Sci-Fi", "Thriller"],
        poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg"
    },
    {
        title: "The Shawshank Redemption",
        year: 1994,
        rating: 9.3,
        genres: ["Drama"],
        poster: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg"
    },
    {
        title: "The Dark Knight",
        year: 2008,
        rating: 9.0,
        genres: ["Action", "Crime", "Drama"],
        poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg"
    },
    {
        title: "Pulp Fiction",
        year: 1994,
        rating: 8.9,
        genres: ["Crime", "Drama"],
        poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzJjNDymxYzNlMzI4XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg"
    },
    {
        title: "The Matrix",
        year: 1999,
        rating: 8.7,
        genres: ["Action", "Sci-Fi"],
        poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg"
    },
    {
        title: "Parasite",
        year: 2019,
        rating: 8.6,
        genres: ["Comedy", "Drama", "Thriller"],
        poster: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg"
    },
    {
        title: "Interstellar",
        year: 2014,
        rating: 8.6,
        genres: ["Adventure", "Drama", "Sci-Fi"],
        poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg"
    },
    {
        title: "The Godfather",
        year: 1972,
        rating: 9.2,
        genres: ["Crime", "Drama"],
        poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg"
    },
    {
        title: "Forrest Gump",
        year: 1994,
        rating: 8.8,
        genres: ["Drama", "Romance"],
        poster: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg"
    },
    {
        title: "The Avengers",
        year: 2012,
        rating: 8.0,
        genres: ["Action", "Adventure", "Sci-Fi"],
        poster: "https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg"
    },
    {
        title: "Joker",
        year: 2019,
        rating: 8.4,
        genres: ["Crime", "Drama", "Thriller"],
        poster: "https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg"
    },
    {
        title: "The Silence of the Lambs",
        year: 1991,
        rating: 8.6,
        genres: ["Crime", "Drama", "Thriller"],
        poster: "https://m.media-amazon.com/images/M/MV5BNjNhZTk0ZmEtNjJhMi00YzFlLWE1MmEtYzM1M2ZmMGMwMTU4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg"
    }
];

// Function to generate movie cards
function generateMovieCards(movieList, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    movieList.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        
        card.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-details">
                    <span class="movie-year">${movie.year}</span>
                    <span class="movie-rating">${movie.rating}</span>
                </div>
                <div class="movie-genres">
                    ${movie.genres.map(genre => `<span class="movie-genre">${genre}</span>`).join('')}
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Initialize the application
function initApp() {
    // For recommended movies (shuffle array for variety)
    const shuffledMovies = [...movies].sort(() => Math.random() - 0.5);
    generateMovieCards(shuffledMovies.slice(0, 4), 'recommended-movies');
    
    // For top rated movies (sort by rating)
    const topRatedMovies = [...movies].sort((a, b) => b.rating - a.rating);
    generateMovieCards(topRatedMovies.slice(0, 4), 'top-rated-movies');
    
    // Add event listeners to genre buttons
    const genreButtons = document.querySelectorAll('.genre-btn');
    genreButtons.forEach(button => {
        button.addEventListener('click', () => {
            genreButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const genre = button.textContent;
            if (genre === 'All') {
                generateMovieCards(shuffledMovies.slice(0, 4), 'recommended-movies');
                generateMovieCards(topRatedMovies.slice(0, 4), 'top-rated-movies');
            } else {
                const filteredRecommended = shuffledMovies.filter(movie => 
                    movie.genres.includes(genre)
                ).slice(0, 4);
                
                const filteredTopRated = topRatedMovies.filter(movie => 
                    movie.genres.includes(genre)
                ).slice(0, 4);
                
                generateMovieCards(filteredRecommended, 'recommended-movies');
                generateMovieCards(filteredTopRated, 'top-rated-movies');
            }
        });
    });
    
    // Add event listener to search button
    const searchButton = document.querySelector('.search-box .btn');
    const searchInput = document.querySelector('.search-input');
    
    searchButton.addEventListener('click', () => {
        performSearch();
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            const filteredMovies = movies.filter(movie => 
                movie.title.toLowerCase().includes(searchTerm) ||
                movie.genres.some(genre => genre.toLowerCase().includes(searchTerm))
            );
            
            generateMovieCards(filteredMovies.slice(0, 4), 'recommended-movies');
            generateMovieCards(filteredMovies.slice(0, 4), 'top-rated-movies');
        } else {
            // If search is empty, show default recommendations
            generateMovieCards(shuffledMovies.slice(0, 4), 'recomm
