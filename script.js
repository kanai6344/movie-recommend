// API Configuration
const API_KEY = '6fd7e3bfc70f50a386cf87cd5f2ff5c8'; // Public read-only key for demo
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Global variables
let currentPage = 1;
let currentGenre = 'all';
let currentSearchTerm = '';
let genres = [];

// DOM Elements
const loadingElement = document.getElementById('loading');
const recommendedMoviesElement = document.getElementById('recommended-movies');
const topRatedMoviesElement = document.getElementById('top-rated-movies');
const searchResultsElement = document.getElementById('search-results');
const searchResultsSection = document.getElementById('search-results-section');
const genreFilterElement = document.getElementById('genre-filter');
const searchButton = document.getElementById('search-btn');
const searchInput = document.querySelector('.search-input');
const loadMoreButton = document.getElementById('load-more-btn');

// Initialize the application
async function initApp() {
    showLoading();
    
    try {
        // Fetch genres first
        await fetchGenres();
        
        // Generate genre buttons
        generateGenreButtons();
        
        // Fetch initial movies
        await Promise.all([
            fetchRecommendedMovies(),
            fetchTopRatedMovies()
        ]);
        
        hideLoading();
    } catch (error) {
        console.error('Error initializing app:', error);
        hideLoading();
        alert('Failed to load movies. Please try again later.');
    }
    
    // Set up event listeners
    setupEventListeners();
}

// Fetch movie genres from API
async function fetchGenres() {
    try {
        const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
        const data = await response.json();
        genres = data.genres;
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
}

// Generate genre filter buttons
function generateGenreButtons() {
    // Clear existing buttons (except "All")
    const allButton = genreFilterElement.querySelector('[data-id="all"]');
    genreFilterElement.innerHTML = '';
    genreFilterElement.appendChild(allButton);
    
    // Add genre buttons (limited to 5 for UI)
    genres.slice(0, 5).forEach(genre => {
        const button = document.createElement('button');
        button.className = 'genre-btn';
        button.textContent = genre.name;
        button.setAttribute('data-id', genre.id);
        genreFilterElement.appendChild(button);
    });
}

// Fetch recommended movies
async function fetchRecommendedMovies() {
    try {
        // For demo purposes, we'll use popular movies as recommendations
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=1`);
        const data = await response.json();
        displayMovies(data.results.slice(0, 8), recommendedMoviesElement);
    } catch (error) {
        console.error('Error fetching recommended movies:', error);
    }
}

// Fetch top rated movies
async function fetchTopRatedMovies() {
    try {
        const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=1`);
        const data = await response.json();
        displayMovies(data.results.slice(0, 8), topRatedMoviesElement);
    } catch (error) {
        console.error('Error fetching top rated movies:', error);
    }
}

// Search movies
async function searchMovies(query, page = 1) {
    try {
        const response = await fetch(
            `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error searching movies:', error);
        throw error;
    }
}

// Display movies in the specified container
function displayMovies(movies, container) {
    container.innerHTML = '';
    
    if (movies.length === 0) {
        container.innerHTML = '<p class="no-results">No movies found. Try a different search.</p>';
        return;
    }
    
    movies.forEach(movie => {
        const card = createMovieCard(movie);
        container.appendChild(card);
    });
}

// Create a movie card element
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.dataset.id = movie.id;
    
    const posterUrl = movie.poster_path 
        ? `${IMAGE_BASE_URL}${movie.poster_path}`
        : 'https://via.placeholder.com/300x450/2c2c2c/ffffff?text=No+Image';
    
    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
    
    // Get genre names for this movie
    const movieGenres = movie.genre_ids 
        ? movie.genre_ids.map(id => {
            const genre = genres.find(g => g.id === id);
            return genre ? genre.name : '';
        }).filter(name => name)
        : [];
    
    card.innerHTML = `
        <img src="${posterUrl}" alt="${movie.title}" class="movie-poster">
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="movie-details">
                <span class="movie-year">${year}</span>
                <span class="movie-rating">${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
            </div>
            <div class="movie-genres">
                ${movieGenres.slice(0, 2).map(genre => `<span class="movie-genre">${genre}</span>`).join('')}
            </div>
        </div>
    `;
    
    // Add click event to show movie details
    card.addEventListener('click', () => {
        showMovieDetails(movie.id);
    });
    
    return card;
}

// Show movie details in a modal
async function showMovieDetails(movieId) {
    showLoading();
    
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
        const movie = await response.json();
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'movie-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${movie.title}</h2>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <img src="${movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/300x450/2c2c2c/ffffff?text=No+Image'}" 
                         alt="${movie.title}" class="modal-poster">
                    <div class="modal-details">
                        <h3 class="modal-title">${movie.title}</h3>
                        <p class="modal-overview">${movie.overview || 'No overview available.'}</p>
                        
                        <div class="modal-meta">
                            <div class="meta-item">
                                <span class="meta-label">Release Date</span>
                                <span class="meta-value">${movie.release_date || 'N/A'}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Rating</span>
                                <span class="meta-value">${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Runtime</span>
                                <span class="meta-value">${movie.runtime ? `${movie.runtime} mins` : 'N/A'}</span>
                            </div>
                        </div>
                        
                        <div class="movie-genres">
                            ${movie.genres.map(genre => `<span class="movie-genre">${genre.name}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
        
        // Close modal when clicking close button
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
    } catch (error) {
        console.error('Error fetching movie details:', error);
        alert('Failed to load movie details. Please try again.');
    }
    
    hideLoading();
}

// Set up event listeners
function setupEventListeners() {
    // Genre filter
    genreFilterElement.addEventListener('click', (e) => {
        if (e.target.classList.contains('genre-btn')) {
            const genreButtons = genreFilterElement.querySelectorAll('.genre-btn');
            genreButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            currentGenre = e.target.dataset.id;
            currentPage = 1;
            
            if (currentSearchTerm) {
                // If we're in search mode, filter search results
                performSearch(currentSearchTerm, currentGenre);
            } else {
                // Otherwise, filter recommended movies
                filterMoviesByGenre(currentGenre);
            }
        }
    });
    
    // Search button
    searchButton.addEventListener('click', () => {
        performSearch(searchInput.value.trim());
    });
    
    // Search input enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value.trim());
        }
    });
    
    // Load more button
    loadMoreButton.addEventListener('click', () => {
        currentPage++;
        
        if (currentSearchTerm) {
            // Load more search results
            loadMoreSearchResults(currentSearchTerm, currentGenre, currentPage);
        } else {
            // Load more movies based on current genre
            loadMoreMovies(currentGenre, currentPage);
        }
    });
}

// Perform search
async function performSearch(query, genreId = 'all') {
    if (!query) {
        alert('Please enter a search term');
        return;
    }
    
    showLoading();
    currentSearchTerm = query;
    currentPage = 1;
    
    try {
        const data = await searchMovies(query, currentPage);
        
        // Filter by genre if needed
        let filteredResults = data.results;
        if (genreId !== 'all') {
            filteredResults = data.results.filter(movie => 
                movie.genre_ids.includes(parseInt(genreId))
            );
        }
        
        // Show search results section
        searchResultsSection.style.display = 'block';
        recommendedMoviesElement.parentElement.style.display = 'none';
        topRatedMoviesElement.parentElement.style.display = 'none';
        
        displayMovies(filteredResults, searchResultsElement);
        
        // Show or hide load more button based on total pages
        loadMoreButton.style.display = data.total_pages > currentPage ? 'block' : 'none';
    } catch (error) {
        console.error('Error performing search:', error);
        alert('Search failed. Please try again.');
    }
    
    hideLoading();
}

// Load more search results
async function loadMoreSearchResults(query, genreId = 'all', page) {
    showLoading();
    
    try {
        const data = await searchMovies(query, page);
        
        // Filter by genre if needed
        let filteredResults = data.results;
        if (genreId !== 'all') {
            filteredResults = data.results.filter(movie => 
                movie.genre_ids.includes(parseInt(genreId))
            );
        }
        
        // Append new results
        filteredResults.forEach(movie => {
            const card = createMovieCard(movie);
            searchResultsElement.appendChild(card);
        });
        
        // Show or hide load more button based on total pages
        loadMoreButton.style.display = data.total_pages > currentPage ? 'block' : 'none';
    } catch (error) {
        console.error('Error loading more search results:', error);
        alert('Failed to load more results. Please try again.');
    }
    
    hideLoading();
}

// Filter movies by genre
async function filterMoviesByGenre(genreId) {
    showLoading();
    
    try {
        let url;
        if (genreId === 'all') {
            url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=1`;
        } else {
            url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=1`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        displayMovies(data.results.slice(0, 8), recommendedMoviesElement);
        
        // Show or hide load more button
        loadMoreButton.style.display = data.total_pages > 1 ? 'block' : 'none';
    } catch (error) {
        console.error('Error filtering movies by genre:', error);
        alert('Failed to filter movies. Please try again.');
    }
    
    hideLoading();
}

// Load more movies
async function loadMoreMovies(genreId, page) {
    showLoading();
    
    try {
        let url;
        if (genreId === 'all') {
            url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;
        } else {
            url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        // Append new movies
        data.results.forEach(movie => {
            const card = createMovieCard(movie);
            recommendedMoviesElement.appendChild(card);
        });
        
        // Show or hide load more button based on total pages
        loadMoreButton.style.display = data.total_pages > currentPage ? 'block' : 'none';
    } catch (error) {
        console.error('Error loading more movies:', error);
        alert('Failed to load more movies. Please try again.');
    }
    
    hideLoading();
}

// Show loading indicator
function showLoading() {
    loadingElement.style.display = 'block';
}

// Hide loading indicator
function hideLoading() {
    loadingElement.style.display = 'none';
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);
