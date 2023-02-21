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

const renderMovies = (movies) => {
  const moviesContainer = document.getElementById("movies-container");
  moviesContainer.innerHTML = "";
  movies.forEach((movie) => {
    const movieElement = createMovieElement(movie);
    moviesContainer.appendChild(movieElement);
  });
};

const createMovieElement = (movie) => {
  const movieElement = document.createElement("div");
  movieElement.classList.add("movie-tile");

  movieElement.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
    <h2>${movie.title} (${new Date(movie.release_date).getFullYear()})</h2>
    <p>${movie.overview}</p>
    <p><strong>Genres:</strong> ${movie.genre_ids.join(", ")}</p>
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
