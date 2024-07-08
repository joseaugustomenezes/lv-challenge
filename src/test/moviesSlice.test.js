import moviesSlice, { fetchMovies } from '../data/moviesSlice';
import { moviesMock } from './movies.mocks';

describe('MovieSlice test', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      movies: {},
      movieIds: [],
      fetchStatus: '',
      lastFetchType: '',
      totalPages: undefined,
      lastFetchPage: undefined,
      lastSearchedTerm: undefined,
    };
  });

  it('should set loading true while action is pending', () => {
    const action = { type: fetchMovies.pending };
    const result = moviesSlice.reducer(initialState, action);
    expect(result).toEqual({ ...initialState, fetchStatus: 'loading' });
  });

  it('should update state when action is fulfilled', () => {
    const moviesPayloadMock = {
      results: moviesMock,
      total_pages: 1,
      page: 1,
    };

    const action = {
      type: fetchMovies.fulfilled,
      payload: {
        movies: moviesPayloadMock,
        fetchType: 'discover',
        searchedTerm: 'test',
      },
    };
    const result = moviesSlice.reducer(initialState, action);

    const expectedMovies = {};
    const expectedMovieIds = [];
    moviesPayloadMock.results.forEach((movie) => {
      expectedMovies[movie['id']] = movie;
      expectedMovieIds.push(movie['id']);
    });

    expect(result).toEqual({
      movies: expectedMovies,
      movieIds: expectedMovieIds,
      fetchStatus: 'success',
      lastFetchType: 'discover',
      totalPages: 1,
      lastFetchPage: 1,
      lastSearchedTerm: 'test',
    });
  });

  it('should add movies when a new page is fetched from discover', () => {
    const moviesPayloadMock = {
      results: [moviesMock[1]],
      total_pages: 2,
      page: 2,
    };

    initialState = {
      movies: { [moviesMock[0]['id']]: moviesMock[0] },
      movieIds: [moviesMock[0]['id']],
      fetchStatus: 'success',
      lastFetchType: 'discover',
      totalPages: 2,
      lastFetchPage: 1,
      lastSearchedTerm: undefined,
    };

    const action = {
      type: fetchMovies.fulfilled,
      payload: {
        movies: moviesPayloadMock,
        fetchType: 'discover',
      },
    };

    const result = moviesSlice.reducer(initialState, action);

    const expectedMovies = {};
    const expectedMovieIds = [];
    moviesMock.forEach((movie) => {
      expectedMovies[movie['id']] = movie;
      expectedMovieIds.push(movie['id']);
    });

    expect(result).toEqual({
      movies: expectedMovies,
      movieIds: expectedMovieIds,
      fetchStatus: 'success',
      lastFetchType: 'discover',
      totalPages: 2,
      lastFetchPage: 2,
      lastSearchedTerm: undefined,
    });
  });

  it('should set different movies when fetch type changes to search', () => {
    const moviesPayloadMock = {
      results: [moviesMock[1]],
      total_pages: 10,
      page: 1,
    };

    initialState = {
      movies: { [moviesMock[0]['id']]: moviesMock[0] },
      movieIds: [moviesMock[0]['id']],
      fetchStatus: 'success',
      lastFetchType: 'discover',
      totalPages: 2,
      lastFetchPage: 1,
      lastSearchedTerm: undefined,
    };

    const action = {
      type: fetchMovies.fulfilled,
      payload: {
        movies: moviesPayloadMock,
        fetchType: 'search',
        searchedTerm: 'bar',
      },
    };

    const result = moviesSlice.reducer(initialState, action);

    const expectedMovies = {};
    const expectedMovieIds = [];
    moviesPayloadMock.results.forEach((movie) => {
      expectedMovies[movie['id']] = movie;
      expectedMovieIds.push(movie['id']);
    });

    expect(result).toEqual({
      movies: expectedMovies,
      movieIds: expectedMovieIds,
      fetchStatus: 'success',
      lastFetchType: 'search',
      totalPages: 10,
      lastFetchPage: 1,
      lastSearchedTerm: 'bar',
    });
  });

  it('should add movies when a new page is fetched from search', () => {
    const moviesPayloadMock = {
      results: [moviesMock[1]],
      total_pages: 2,
      page: 2,
    };

    initialState = {
      movies: { [moviesMock[0]['id']]: moviesMock[0] },
      movieIds: [moviesMock[0]['id']],
      fetchStatus: 'success',
      lastFetchType: 'search',
      totalPages: 2,
      lastFetchPage: 1,
      lastSearchedTerm: 'foo',
    };

    const action = {
      type: fetchMovies.fulfilled,
      payload: {
        movies: moviesPayloadMock,
        fetchType: 'search',
        searchedTerm: 'foo',
      },
    };

    const result = moviesSlice.reducer(initialState, action);

    const expectedMovies = {};
    const expectedMovieIds = [];
    moviesMock.forEach((movie) => {
      expectedMovies[movie['id']] = movie;
      expectedMovieIds.push(movie['id']);
    });

    expect(result).toEqual({
      movies: expectedMovies,
      movieIds: expectedMovieIds,
      fetchStatus: 'success',
      lastFetchType: 'search',
      totalPages: 2,
      lastFetchPage: 2,
      lastSearchedTerm: 'foo',
    });
  });

  it('should set different movies when a new page is fetched from a different search', () => {
    const moviesPayloadMock = {
      results: [moviesMock[1]],
      total_pages: 10,
      page: 1,
    };

    initialState = {
      movies: { [moviesMock[0]['id']]: moviesMock[0] },
      movieIds: [moviesMock[0]['id']],
      fetchStatus: 'success',
      lastFetchType: 'search',
      totalPages: 2,
      lastFetchPage: 1,
      lastSearchedTerm: 'foo',
    };

    const action = {
      type: fetchMovies.fulfilled,
      payload: {
        movies: moviesPayloadMock,
        fetchType: 'search',
        searchedTerm: 'bar',
      },
    };

    const result = moviesSlice.reducer(initialState, action);

    const expectedMovies = {};
    const expectedMovieIds = [];
    [moviesMock[1]].forEach((movie) => {
      expectedMovies[movie['id']] = movie;
      expectedMovieIds.push(movie['id']);
    });

    expect(result).toEqual({
      movies: expectedMovies,
      movieIds: expectedMovieIds,
      fetchStatus: 'success',
      lastFetchType: 'search',
      totalPages: 10,
      lastFetchPage: 1,
      lastSearchedTerm: 'bar',
    });
  });

  it('should set error when action is rejected', () => {
    const action = { type: fetchMovies.rejected };
    const result = moviesSlice.reducer(initialState, action);
    expect(result).toEqual({ ...initialState, fetchStatus: 'error' });
  });
});
