import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import Movies from '../components/Movies/Movies';
import configureMockStore from 'redux-mock-store';
import useInfiniteScroll from '../components/Movies/useInfiniteScroll';
import { useSearchParams } from 'react-router-dom';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useSearchParams: jest.fn(),
}));

const mockStore = configureMockStore();
const useDispatchMock = useDispatch;
const useSelectorMock = useSelector;

jest.mock('../components/Movies/useInfiniteScroll', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const MockMovie = ({ movie }) => (
  <div className="mock-movie">
    <span className="mock-title">{movie.title}</span>
  </div>
);

// eslint-disable-next-line react/display-name
jest.mock('../components/Movie', () => ({ movie }) => (
  <MockMovie className="movie-item" movie={movie} />
));

describe('Movies component', () => {
  let store;
  let mockDispatch;

  beforeEach(() => {
    store = mockStore({});
    mockDispatch = jest.fn();
    useDispatchMock.mockReturnValue(mockDispatch);
    const mockSearchParams = {
      get: jest.fn((key) => (key === 'search' ? 'action' : null)),
    };
    useSearchParams.mockReturnValue([mockSearchParams]);
    const loaderRef = { current: jest.fn() };
    useInfiniteScroll.mockReturnValue({ loader: loaderRef });
    useSelectorMock.mockImplementation((callback) => {
      return callback({
        movies: {
          movies: {
            1: { id: 1, title: 'Movie 1' },
            2: { id: 2, title: 'Movie 2' },
          },
          fetchStatus: 'idle', // or 'loading', 'error'
          movieIds: [1, 2],
        },
      });
    });
  });

  const renderWithProviders = async (ui) => {
    return act(async () => render(<Provider store={store}>{ui}</Provider>));
  };

  it('renders movies grid when movies are available', async () => {
    await renderWithProviders(<Movies />);

    const movieGrid = screen.getByTestId('movies');
    expect(movieGrid).toBeInTheDocument();

    const movieItems = screen.getAllByText(/Movie/i);
    expect(movieItems).toHaveLength(2); // Adjust based on your mocked movies data
  });

  it('renders loading state when fetching movies', async () => {
    useSelectorMock.mockImplementation((callback) => {
      return callback({
        movies: {
          movies: {},
          fetchStatus: 'loading',
          movieIds: [],
        },
      });
    });

    await renderWithProviders(<Movies />);

    const loadingMessage = screen.getByText('Loading...');
    expect(loadingMessage).toBeInTheDocument();
  });

  it('renders error state when fetching movies fails', async () => {
    useSelectorMock.mockImplementation((callback) => {
      return callback({
        movies: {
          movies: {},
          fetchStatus: 'error',
          movieIds: [],
        },
      });
    });

    await renderWithProviders(<Movies />);

    const errorMessage = screen.getByText('Error fetching movies.');
    expect(errorMessage).toBeInTheDocument();
  });

  it('renders "No movie was found" message when movieIds are empty', async () => {
    useSelectorMock.mockImplementation((callback) => {
      return callback({
        movies: {
          movies: {},
          fetchStatus: 'idle',
          movieIds: [],
        },
      });
    });

    await renderWithProviders(<Movies />);

    const noMovieMessage = screen.getByText('No movie was found.');
    expect(noMovieMessage).toBeInTheDocument();
  });
});
