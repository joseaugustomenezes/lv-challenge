import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ENDPOINT_MOVIE } from '../constants';

export const fetchTrailer = createAsyncThunk(
  'fetch-trailer',
  async (movieId) => {
    const response = await fetch(ENDPOINT_MOVIE.replace('{id}', movieId));

    if (!response.ok) {
      throw new Error('Error fetching the trailer.');
    }

    const videoData = await response.json();

    const videoResults = videoData.videos?.results || [];
    const trailer = videoResults.find((vid) => vid.type === 'Trailer');
    if (trailer) {
      return trailer.key;
    }

    return videoResults[0]?.key;
  },
);

const selectedTrailerSlice = createSlice({
  name: 'selectedTrailer',
  initialState: {
    selectedTrailerKey: undefined,
    fetchStatus: '',
  },
  reducers: {
    clearSelectedTrailerKey: (state) => {
      state.selectedTrailerKey = undefined;
      state.fetchStatus = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrailer.fulfilled, (state, action) => {
        state.selectedTrailerKey = action.payload;
        state.fetchStatus = 'success';
      })
      .addCase(fetchTrailer.pending, (state) => {
        state.fetchStatus = 'loading';
      })
      .addCase(fetchTrailer.rejected, (state) => {
        state.fetchStatus = 'error';
      });
  },
});

export default selectedTrailerSlice;
