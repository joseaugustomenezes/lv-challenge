import React, { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import TrailerModal from '../components/TrailerModal/TrailerModal';
import { useDispatch, useSelector } from 'react-redux';
import configureMockStore from 'redux-mock-store';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../components/YoutubePlayer', () => () => (
  <div data-testid="youtube-player">Mock Player</div>
));

const mockStore = configureMockStore();
const useDispatchMock = useDispatch;
const useSelectorMock = useSelector;

describe('TrailerModal component', () => {
  let store;
  let mockDispatch;

  beforeEach(() => {
    store = mockStore({});
    useDispatch.mockReturnValue(jest.fn());
  });

  const renderWithProviders = async (ui) => {
    return act(async () => render(<Provider store={store}>{ui}</Provider>));
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders YouTubePlayer when fetchStatus is success', async () => {
    useSelectorMock.mockImplementation((callback) => {
      return callback({
        selectedTrailer: {
          selectedTrailerKey: 'fakeVideoKey',
          fetchStatus: 'success',
        },
      });
    });

    await renderWithProviders(<TrailerModal />);

    const closeButton = screen.getByText('X');
    expect(closeButton).toBeInTheDocument();

    const playerElement = screen.getByTestId('youtube-player');
    expect(playerElement).toBeInTheDocument();
  });

  it('renders error message when fetchStatus is error', async () => {
    useSelector.mockReturnValue({
      selectedTrailerKey: null,
      fetchStatus: 'error',
    });

    await renderWithProviders(<TrailerModal />);

    const errorMessage = screen.getByText('Error fetching the trailer.');
    expect(errorMessage).toBeInTheDocument();
  });

  it('renders loading message when fetchStatus is loading', async () => {
    useSelector.mockReturnValue({
      selectedTrailerKey: null,
      fetchStatus: 'loading',
    });

    await renderWithProviders(<TrailerModal />);

    const loadingMessage = screen.getByText('Loading...');
    expect(loadingMessage).toBeInTheDocument();
  });

  it('calls onClose when clicking close button', async () => {
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);

    useSelector.mockReturnValue({
      selectedTrailerKey: 'fakeVideoKey',
      fetchStatus: 'success',
    });

    await renderWithProviders(<TrailerModal />);

    const closeButton = screen.getByText('X');
    fireEvent.click(closeButton);

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('call onClose when clicking on modal background', async () => {
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);

    useSelector.mockReturnValue({
      selectedTrailerKey: 'fakeVideoKey',
      fetchStatus: 'success',
    });

    await renderWithProviders(<TrailerModal />);

    const modalBackground = screen.getByTestId('modal-background');
    fireEvent.click(modalBackground);

    expect(mockDispatch).toHaveBeenCalled();
  });
});
