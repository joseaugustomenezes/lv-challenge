import watchLaterSlice from '../data/watchLaterSlice';
import { moviesMock } from './movies.mocks';

describe('watchLaterSlice test', () => {
  let state;

  beforeEach(() => {
    state = { watchLaterMovies: {}, watchLaterMovieIds: [] };
  });

  const mockInitialState = () => {
    const watchLaterMovies = {};
    const watchLaterMovieIds = [];
    moviesMock.forEach((movie) => {
      watchLaterMovies[movie['id']] = movie;
      watchLaterMovieIds.push(movie['id']);
    });
    return { watchLaterMovies, watchLaterMovieIds };
  };

  it('should set initial state', () => {
    const initialState = state;
    const action = { type: '' };
    const result = watchLaterSlice.reducer(initialState, action);
    expect(result).toEqual({ watchLaterMovies: {}, watchLaterMovieIds: [] });
  });

  it('should add movie to watch later', () => {
    const initialState = state;
    const action = watchLaterSlice.actions.addToWatchLater(moviesMock[0]);
    const result = watchLaterSlice.reducer(initialState, action);
    expect(result.watchLaterMovies[moviesMock[0]['id']]).toBe(moviesMock[0]);
    expect(result.watchLaterMovieIds[0]).toBe(moviesMock[0]['id']);
  });

  it('should remove movie from watch later', () => {
    const initialState = mockInitialState();
    const action = watchLaterSlice.actions.removeFromWatchLater(moviesMock[0]);
    const result = watchLaterSlice.reducer(initialState, action);
    expect(Object.values(result.watchLaterMovies)[0]).toBe(moviesMock[1]);
    expect(result.watchLaterMovieIds[0]).toBe(moviesMock[1]['id']);
  });

  it('should remove all movies', () => {
    const initialState = mockInitialState();
    const action = watchLaterSlice.actions.removeAllWatchLater(initialState);
    const result = watchLaterSlice.reducer(initialState, action);
    expect(result).toEqual({ watchLaterMovies: {}, watchLaterMovieIds: [] });
  });
});
