// Header.test.js
import React, { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider, useSelector } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/Header';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

const mockStore = configureMockStore();
const useSelectorMock = useSelector;

describe('Header component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    useSelectorMock.mockImplementation((callback) => {
      return callback({
        starred: {
          starredMovieIds: [1, 2, 3],
        },
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProviders = async (ui) => {
    return act(async () =>
      render(
        <Provider store={store}>
          <MemoryRouter>{ui}</MemoryRouter>
        </Provider>,
      ),
    );
  };

  it('renders navigation links correctly', async () => {
    await renderWithProviders(<Header />);

    expect(screen.getByTestId('home')).toHaveAttribute('href', '/');
    expect(screen.getByTestId('nav-starred')).toHaveAttribute(
      'href',
      '/starred',
    );
    expect(screen.getByText('watch later')).toHaveAttribute(
      'href',
      '/watch-later',
    );
  });

  it('displays starred count when there are starred movies', async () => {
    await renderWithProviders(<Header />);

    expect(
      screen.getByTestId('nav-starred').querySelector('.star-number'),
    ).toHaveTextContent('3');
  });

  it('displays star icon without count when there are no starred movies', async () => {
    store = mockStore({
      starred: {
        starredMovieIds: [], // Empty starredMovieIds array
      },
    });

    await renderWithProviders(<Header />);

    expect(screen.queryByText('bi-star-fill')).toBeNull();
    expect(screen.queryByText('.star-number')).toBeNull();
  });

  it('updates searchInput state on input change', async () => {
    await renderWithProviders(<Header />);

    const searchInput = screen.getByTestId('search-movies');
    fireEvent.change(searchInput, { target: { value: 'Test Movie' } });

    expect(searchInput).toHaveValue('Test Movie');
  });

  it('navigates to Home when clicking on Home link and clears searchInput', async () => {
    await renderWithProviders(<Header />);

    const searchInput = screen.getByTestId('search-movies');
    fireEvent.change(searchInput, { target: { value: 'Test Movie' } });

    const homeLink = screen.getByTestId('home');
    fireEvent.click(homeLink);

    expect(searchInput).toHaveValue('');
    expect(window.location.pathname).toBe('/');
  });
});
