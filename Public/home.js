document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '8e6ec3dd7403cd40326615cc6ce3a1dc';
    const movieContainer = document.getElementById('movie-container');
    const movieDetailsPage = document.getElementById('movie-details');
    const movieTitle = document.getElementById('movie-title');
    const moviePoster = document.getElementById('movie-poster');
    const movieReleaseDate = document.getElementById('movie-release-date');
    const movieRating = document.getElementById('movie-rating');
    const movieDescription = document.getElementById('movie-description');
    const movieCast = document.getElementById('movie-cast');
    const movieTrailer = document.getElementById('movie-trailer');
    const backToHome = document.getElementById('back-to-home');
    const searchInput = document.getElementById('search-input');
    const loadMoreButton = document.getElementById('load-more');
    const movieWebsite = document.createElement('a');
    const movieGenre = document.getElementById('movie-genre');
    const movieDuration = document.getElementById('movie-duration');
    const movieDirector = document.getElementById('movie-director');
    const movieProducer = document.getElementById('movie-producer');
    const movieWriter = document.getElementById('movie-writer');
    const overviewPoster = document.getElementById('overview-poster');

    let page = 1;
    let searchQuery = '';

    async function fetchMovies() {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}&query=${searchQuery}`);
            const data = await response.json();
            displayMovies(data.results);
        } catch (error) {
            console.error('Error fetching movie data:', error);
        }
    }

    function displayMovies(movies) {
        movieContainer.innerHTML = '';
        movies.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie-item');
            movieElement.dataset.id = movie.id;
            movieElement.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                <h3>${movie.title}</h3>
            `;
            movieElement.addEventListener('click', () => {
                showMovieDetails(movie.id);
            });
            movieContainer.appendChild(movieElement);
        });
    }

    async function showMovieDetails(id) {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`);
            const movie = await response.json();

            const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`);
            const credits = await creditsResponse.json();

            const videosResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`);
            const videos = await videosResponse.json();
            const trailer = videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');

            movieTitle.textContent = movie.title;
            moviePoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            movieReleaseDate.textContent = `Release Date: ${movie.release_date}`;
            movieRating.textContent = `Rating: ${movie.vote_average}`;
            movieDescription.textContent = movie.overview;

            // New details added
            movieGenre.textContent = `Genre: ${movie.genres.map(genre => genre.name).join(', ')}`;
            movieDuration.textContent = `Duration: ${movie.runtime} minutes`;
            movieDirector.textContent = `Director: ${credits.crew.find(member => member.job === 'Director')?.name || 'N/A'}`;
            movieProducer.textContent = `Producer: ${credits.crew.find(member => member.job === 'Producer')?.name || 'N/A'}`;
            movieWriter.textContent = `Writer: ${credits.crew.find(member => member.job === 'Writer')?.name || 'N/A'}`;
            overviewPoster.src = `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`;

            movieCast.innerHTML = '';
            credits.cast.forEach(actor => {
                const castItem = document.createElement('div');
                castItem.classList.add('cast-item');
                castItem.innerHTML = `
                    <img src="https://image.tmdb.org/t/p/w500${actor.profile_path}" alt="${actor.name}">
                    <p>${actor.name}</p>
                `;
                movieCast.appendChild(castItem);
            });

            if (trailer) {
                movieTrailer.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            } else {
                movieTrailer.innerHTML = '<p>No trailer available.</p>';
            }

            movieWebsite.href = `https://www.themoviedb.org/movie/${id}`;
            movieWebsite.textContent = 'View on TMDb';
            movieWebsite.target = '_blank';
            movieWebsite.style.display = 'block';

            document.querySelector('.dashboard').style.display = 'none';
            movieDetailsPage.style.display = 'block';
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    }

    backToHome.addEventListener('click', () => {
        movieDetailsPage.style.display = 'none';
        document.querySelector('.dashboard').style.display = 'block';
    });

    searchInput.addEventListener('input', (event) => {
        searchQuery = event.target.value;
        page = 1;
        movieContainer.innerHTML = '';
        fetchMovies();
    });

    loadMoreButton.addEventListener('click', () => {
        page += 1;
        fetchMovies();
    });

    fetchMovies();
});
