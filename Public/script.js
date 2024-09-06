document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '8e6ec3dd7403cd40326615cc6ce3a1dc';
    const movieContainer = document.getElementById('movie-container');
    const loadMoreBtn = document.getElementById('load-more');
    const searchInput = document.getElementById('search-input');
    const movieDetailsPage = document.getElementById('movie-details');
    const dashboard = document.querySelector('.dashboard');
    let currentPage = 1;
    let searchQuery = '';

    // Function to fetch movies
    async function fetchMovies(page = 1, query = '') {
        const url = query
            ? `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=${page}`
            : `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`;
        const response = await fetch(url);
        const data = await response.json();
        displayMovies(data.results);
    }

    // Function to display movies in the grid
    function displayMovies(movies) {
        movies.forEach(movie => {
            const movieItem = document.createElement('div');
            movieItem.classList.add('movie-item');
            movieItem.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                <h3>${movie.title}</h3>
            `;
            movieItem.addEventListener('click', () => showMovieDetails(movie.id));
            movieContainer.appendChild(movieItem);
        });
    }

    // Show movie details when clicked
    async function showMovieDetails(movieId) {
        const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=credits,videos`;
        const response = await fetch(url);
        const movie = await response.json();

        document.getElementById('movie-title').textContent = movie.title;
        document.getElementById('movie-poster').src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        document.getElementById('movie-release-date').textContent = `Release Date: ${movie.release_date}`;
        document.getElementById('movie-rating').textContent = `Rating: ${movie.vote_average}`;
        document.getElementById('movie-genre').textContent = `Genre: ${movie.genres.map(g => g.name).join(', ')}`;
        document.getElementById('movie-duration').textContent = `Duration: ${movie.runtime} minutes`;
        document.getElementById('movie-director').textContent = `Director: ${movie.credits.crew.find(c => c.job === 'Director')?.name || 'N/A'}`;
        document.getElementById('movie-producer').textContent = `Producer: ${movie.credits.crew.find(c => c.job === 'Producer')?.name || 'N/A'}`;
        document.getElementById('movie-writer').textContent = `Writer: ${movie.credits.crew.find(c => c.job === 'Screenplay')?.name || 'N/A'}`;
        document.getElementById('movie-description').textContent = movie.overview;

        const castList = document.getElementById('movie-cast');
        castList.innerHTML = '';
        movie.credits.cast.slice(0, 5).forEach(cast => {
            const castItem = document.createElement('li');
            castItem.textContent = cast.name;
            castList.appendChild(castItem);
        });

        const trailer = movie.videos.results.find(video => video.type === 'Trailer');
        if (trailer) {
            document.getElementById('movie-trailer').innerHTML = `<iframe src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>`;
        }

        document.getElementById('movie-website').href = movie.homepage || '#';
        movieDetailsPage.style.display = 'block';
        dashboard.style.display = 'none';
    }

    // Load more movies on button click
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        fetchMovies(currentPage, searchQuery);
    });

    // Search movies on input change
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        movieContainer.innerHTML = '';
        currentPage = 1;
        fetchMovies(currentPage, searchQuery);
    });

    // Back to home from movie details
    document.getElementById('back-to-home').addEventListener('click', () => {
        movieDetailsPage.style.display = 'none';
        dashboard.style.display = 'block';
    });

    // Initial movie fetch
    fetchMovies();

    // Login and Signup logic
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginLink = document.querySelector('.login-link');
    const registerLink = document.querySelector('.register-link');
    const loginBox = document.querySelector('.form-box.login');
    const registerBox = document.querySelector('.form-box.register');
    const loginInfoText = document.querySelector('.info-text.login');
    const registerInfoText = document.querySelector('.info-text.register');

    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginBox.style.display = 'block';
        registerBox.style.display = 'none';
        loginInfoText.style.display = 'block';
        registerInfoText.style.display = 'none';
    });

    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginBox.style.display = 'none';
        registerBox.style.display = 'block';
        loginInfoText.style.display = 'none';
        registerInfoText.style.display = 'block';
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        dashboard.style.display = 'block';
        loginBox.style.display = 'none';
        loginInfoText.style.display = 'none';
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // For simplicity, assuming successful signup
        loginBox.style.display = 'block';
        registerBox.style.display = 'none';
        loginInfoText.style.display = 'block';
        registerInfoText.style.display = 'none';
    });
});
