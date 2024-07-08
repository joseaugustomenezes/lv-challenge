/* eslint-disable react/display-name */
import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { fetchMovies } from './data/moviesSlice';
import { HOME, STARRED, WATCH_LATER } from './routes';

jest.mock('./data/moviesSlice');
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: jest.fn(),
}));
jest.mock('./components/Header', () => () => <div>Mock Header</div>);
jest.mock('./components/TrailerModal/TrailerModal', () => () => (
  <div>Mock Modal</div>
));
jest.mock('./components/Movies/Movies', () => () => <div>Mock Movies</div>);
jest.mock('./components/Starred', () => () => <div>Mock Starred</div>);
jest.mock('./components/WatchLater', () => () => <div>Mock Watch Later</div>);

const mockStore = configureMockStore();
const useDispatch = require('react-redux').useDispatch;
const useSearchParams = require('react-router-dom').useSearchParams;

describe('App component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    useDispatch.mockReturnValue(jest.fn());
  });

  const renderWithProviders = async (ui, { route = HOME } = {}) => {
    window.history.pushState({}, 'Test page', route);

    return act(async () =>
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </Provider>,
      ),
    );
  };

  it('dispatches fetchMovies with search query', async () => {
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    useSearchParams.mockReturnValue([{ get: () => 'test' }, jest.fn()]);

    await renderWithProviders(<App />);

    expect(mockDispatch).toHaveBeenCalledWith(
      fetchMovies({
        apiUrl: 'ENDPOINT_SEARCH',
        fetchType: 'search',
        searchedTerm: 'test',
      }),
    );
  });

  it('dispatches fetchMovies without search query', async () => {
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    useSearchParams.mockReturnValue([{ get: () => '' }, jest.fn()]);

    await renderWithProviders(<App />);

    expect(mockDispatch).toHaveBeenCalledWith(
      fetchMovies({
        apiUrl: 'ENDPOINT_DISCOVER',
        fetchType: 'discover',
      }),
    );
  });

  it('renders Header, Movies, and TrailerModal components', async () => {
    useSearchParams.mockReturnValue([{ get: () => '' }, jest.fn()]);

    await renderWithProviders(<App />);

    expect(screen.getByText('Mock Header')).toBeInTheDocument();
  });

  it('renders Starred component on /starred route', async () => {
    useSearchParams.mockReturnValue([{ get: () => '' }, jest.fn()]);

    await renderWithProviders(<App />, { route: STARRED });

    expect(screen.getByText('Mock Starred')).toBeInTheDocument();
  });

  it('renders WatchLater component on /watch-later route', async () => {
    useSearchParams.mockReturnValue([{ get: () => '' }, jest.fn()]);

    await renderWithProviders(<App />, { route: WATCH_LATER });

    expect(screen.getByText('Mock Watch Later')).toBeInTheDocument();
  });

  it('renders Page Not Found for unknown routes', async () => {
    useSearchParams.mockReturnValue([{ get: () => '' }, jest.fn()]);

    await renderWithProviders(<App />, { route: '/unknown-route' });

    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });
});
