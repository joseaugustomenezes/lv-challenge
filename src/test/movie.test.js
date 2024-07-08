// Movie.test.js
import React, { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { useDispatch, useSelector } from 'react-redux';
import Movie from '../components/Movie';
import starredSlice from '../data/starredSlice';
import watchLaterSlice from '../data/watchLaterSlice';
import { fetchTrailer } from '../data/selectedTrailerSlice';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

const mockStore = configureMockStore();
const useDispatchMock = useDispatch;
const useSelectorMock = useSelector;

jest.mock('../data/selectedTrailerSlice', () => ({
  fetchTrailer: jest
    .fn()
    .mockImplementation((id) => ({ type: 'FETCH_TRAILER', payload: id })),
}));

describe('Movie component', () => {
  let store;
  let mockDispatch;

  const movie = {
    id: 1,
    title: 'Test Movie',
    overview: 'Test Overview',
    release_date: '2022-01-01',
    poster_path: 'testpath.jpg',
  };

  beforeEach(() => {
    store = mockStore({});
    mockDispatch = jest.fn();
    useDispatchMock.mockReturnValue(mockDispatch);
    useSelectorMock.mockImplementation((callback) => {
      return callback({
        starred: { starredMovies: {} },
        watchLater: { watchLaterMovies: {} },
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProviders = async (ui) => {
    return act(async () => render(<Provider store={store}>{ui}</Provider>));
  };

  it('renders movie details correctly', async () => {
    await renderWithProviders(<Movie movie={movie} />);

    expect(screen.getAllByText('Test Movie').length).toBe(2);
    expect(screen.getByText('Test Overview')).toBeInTheDocument();
    expect(screen.getByText('2022')).toBeInTheDocument();
    expect(screen.getByAltText('Movie poster')).toHaveAttribute(
      'src',
      'https://image.tmdb.org/t/p/w500/testpath.jpg',
    );
  });

  it('dispatches starMovie action on star button click', async () => {
    await renderWithProviders(<Movie movie={movie} />);

    fireEvent.click(screen.getByTestId('starred-link'));

    expect(mockDispatch).toHaveBeenCalledWith(
      starredSlice.actions.starMovie({
        ...movie,
        release_date: '2022',
      }),
    );
  });

  it('dispatches unstarMovie action on unstar button click', async () => {
    useSelectorMock.mockImplementation((callback) => {
      return callback({
        starred: { starredMovies: { 1: movie } },
        watchLater: { watchLaterMovies: {} },
      });
    });

    await renderWithProviders(<Movie movie={movie} />);

    fireEvent.click(screen.getByTestId('unstar-link'));

    expect(mockDispatch).toHaveBeenCalledWith(
      starredSlice.actions.unstarMovie(movie),
    );
  });

  it('dispatches addToWatchLater action on Watch Later button click', async () => {
    await renderWithProviders(<Movie movie={movie} />);

    fireEvent.click(screen.getByTestId('watch-later'));

    expect(mockDispatch).toHaveBeenCalledWith(
      watchLaterSlice.actions.addToWatchLater({
        ...movie,
        release_date: '2022',
      }),
    );
  });

  it('dispatches removeFromWatchLater action on remove Watch Later button click', async () => {
    useSelectorMock.mockImplementation((callback) => {
      return callback({
        starred: { starredMovies: {} },
        watchLater: { watchLaterMovies: { 1: movie } },
      });
    });

    await renderWithProviders(<Movie movie={movie} />);

    fireEvent.click(screen.getByTestId('remove-watch-later'));

    expect(mockDispatch).toHaveBeenCalledWith(
      watchLaterSlice.actions.removeFromWatchLater(movie),
    );
  });

  it('dispatches fetchTrailer action on View Trailer button click', async () => {
    await renderWithProviders(<Movie movie={movie} />);

    fireEvent.click(screen.getByText('View Trailer'));

    expect(mockDispatch).toHaveBeenCalledWith(fetchTrailer(movie.id));
  });
});
