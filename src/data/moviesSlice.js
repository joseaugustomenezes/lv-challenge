import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchMovies = createAsyncThunk(
  'fetch-movies',
  async ({ apiUrl, fetchType, searchedTerm }) => {
    const response = await fetch(apiUrl);
    const movies = await response.json();
    return {
      movies,
      fetchType,
      searchedTerm,
    };
  },
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    movies: {},
    movieIds: [],
    fetchStatus: '',
    lastFetchType: '',
    totalPages: undefined,
    lastFetchPage: undefined,
    lastSearchedTerm: undefined,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.fulfilled, (state, action) => {
        const { fetchType, movies, searchedTerm } = action.payload;
        if (fetchType === 'search' && searchedTerm !== state.lastSearchedTerm) {
          state.movies = {};
          state.movieIds = [];
        }
        if (fetchType !== state.lastFetchType) {
          state.movies = {};
          state.movieIds = [];
          state.lastFetchType = fetchType;
        }
        movies.results?.forEach((movie) => {
          if (!state.movies[movie.id]) {
            state.movies[movie.id] = movie;
            state.movieIds.push(movie.id);
          }
        });
        state.lastSearchedTerm = searchedTerm;
        state.totalPages = movies.total_pages;
        state.lastFetchPage = movies.page;
        state.fetchStatus = 'success';
      })
      .addCase(fetchMovies.pending, (state) => {
        state.fetchStatus = 'loading';
      })
      .addCase(fetchMovies.rejected, (state) => {
        state.fetchStatus = 'error';
      });
  },
});

export default moviesSlice;
