import React, { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import WatchLater from '../components/WatchLater';
import watchLaterSlice from '../data/watchLaterSlice';

const mockStore = configureMockStore();
const { removeAllWatchLater } = watchLaterSlice.actions;

describe('WatchLater component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      watchLater: {
        watchLaterMovies: {
          1: { id: 1, title: 'Movie 1' },
          2: { id: 2, title: 'Movie 2' },
        },
        watchLaterMovieIds: [1, 2],
      },
      starred: {
        starredMovies: {
          1: { id: 1, title: 'Movie 1' },
          2: { id: 2, title: 'Movie 2' },
        },
        starredMovieIds: [1, 2],
      },
    });
    store.dispatch = jest.fn();
  });

  const renderWithProvider = async (component) => {
    return act(() =>
      render(
        <Provider store={store}>
          <BrowserRouter>{component}</BrowserRouter>
        </Provider>,
      ),
    );
  };

  it('renders watch later movies when the list is not empty', async () => {
    await renderWithProvider(<WatchLater />);

    expect(screen.getByTestId('watch-later-div')).toBeInTheDocument();
    expect(screen.getByTestId('watch-later-movies')).toBeInTheDocument();
    expect(
      screen.queryByText('You have no movies saved to watch later.'),
    ).not.toBeInTheDocument();
    expect(screen.getAllByText(/Movie/i).length).toBe(4); // there's the mobile title
  });

  it('renders empty state when the watch later list is empty', async () => {
    store = mockStore({
      watchLater: {
        watchLaterMovies: {},
        watchLaterMovieIds: [],
      },
      starred: {
        starredMovies: {
          1: { id: 1, title: 'Movie 1' },
          2: { id: 2, title: 'Movie 2' },
        },
        starredMovieIds: [1, 2],
      },
    });

    await renderWithProvider(<WatchLater />);

    expect(screen.getByTestId('watch-later-div')).toBeInTheDocument();
    expect(screen.queryByTestId('watch-later-movies')).not.toBeInTheDocument();
    expect(
      screen.getByText('You have no movies saved to watch later.'),
    ).toBeInTheDocument();
  });

  it('dispatches removeAllWatchLater action when Empty list button is clicked', async () => {
    await renderWithProvider(<WatchLater />);

    fireEvent.click(screen.getByText('Empty list'));

    expect(store.dispatch).toHaveBeenCalledWith(removeAllWatchLater());
  });
});
