const APIKEY = "fba4afc396455452614bf16ee245c62e";

const fetchMovies = async () => {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${APIKEY}`);
    return response.data.results;
  } catch (error) {
    console.log(error);
    
    alert("There was an error", error);
    return [];
  }
};

const renderMovies = async (movies) => {
  const moviesContainer = document.getElementById("movies-container");
  moviesContainer.innerHTML = "";

  // Fetch genres and create a map of genre ids to names
  const genresResponse = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${APIKEY}`);
  const genresMap = new Map(genresResponse.data.genres.map(genre => [genre.id, genre.name]));

  movies.forEach((movie) => {
    const movieElement = createMovieElement(movie, genresMap);
    moviesContainer.appendChild(movieElement);
  });
};

const createMovieElement = (movie, genresMap) => {
  const movieElement = document.createElement("div");
  movieElement.classList.add("movie-tile");

  // Replace genre ids with genre names
  const genreNames = movie.genre_ids.map(id => genresMap.get(id)).join(", ");

  movieElement.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
    <h2>${movie.title} (${new Date(movie.release_date).getFullYear()})</h2>
    <p>${movie.overview}</p>
    <p><strong>Genres:</strong> ${genreNames}</p>
  `;
  return movieElement;
};

const searchMovies = async (query) => {
  if (!query) {
    renderMovies(await fetchMovies());
    return;
  }
  const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&query=${query}`);
  renderMovies(response.data.results);
};

const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", () => searchMovies(searchInput.value));

// Initialize with trending movies
fetchMovies().then((movies) => renderMovies(movies));
