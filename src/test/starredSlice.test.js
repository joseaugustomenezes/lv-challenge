import starredSlice from '../data/starredSlice';
import { moviesMock } from './movies.mocks';

describe('starredSlice test', () => {
  let state;

  beforeEach(() => {
    state = { starredMovies: {}, starredMovieIds: [] };
  });

  const mockInitialState = () => {
    const starredMovies = {};
    const starredMovieIds = [];
    moviesMock.forEach((movie) => {
      starredMovies[movie['id']] = movie;
      starredMovieIds.push(movie['id']);
    });
    return { starredMovies, starredMovieIds };
  };

  it('should set an initial state', () => {
    const initialState = state;
    const action = { type: '' };
    const result = starredSlice.reducer(initialState, action);
    expect(result).toEqual({ starredMovies: {}, starredMovieIds: [] });
  });

  it('should add movie to starred', () => {
    const initialState = state;
    const action = starredSlice.actions.starMovie(moviesMock[0]);
    const result = starredSlice.reducer(initialState, action);
    expect(result.starredMovies[moviesMock[0]['id']]).toBe(moviesMock[0]);
    expect(result.starredMovieIds[0]).toBe(moviesMock[0]['id']);
  });

  it('should remove movie from starred', () => {
    const initialState = mockInitialState();
    const action = starredSlice.actions.unstarMovie(moviesMock[0]);
    const result = starredSlice.reducer(initialState, action);
    expect(Object.values(result.starredMovies)[0]).toBe(moviesMock[1]);
    expect(result.starredMovieIds[0]).toBe(moviesMock[1]['id']);
  });

  it('should remove all movies', () => {
    const initialState = mockInitialState();
    const action = starredSlice.actions.clearAllStarred(state);
    const result = starredSlice.reducer(initialState, action);
    expect(result).toEqual({ starredMovies: {}, starredMovieIds: [] });
  });
});
