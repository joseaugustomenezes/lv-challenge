import { createSlice } from '@reduxjs/toolkit';

const watchLaterSlice = createSlice({
  name: 'watch-later',
  initialState: {
    watchLaterMovies: {},
    watchLaterMovieIds: [],
  },
  reducers: {
    addToWatchLater: (state, action) => {
      if (!state.watchLaterMovies[action.payload.id]) {
        state.watchLaterMovies[action.payload.id] = action.payload;
        state.watchLaterMovieIds.push(action.payload.id);
      }
    },
    removeFromWatchLater: (state, action) => {
      delete state.watchLaterMovies[action.payload.id];
      state.watchLaterMovieIds = state.watchLaterMovieIds.filter(
        (id) => id !== action.payload.id,
      );
    },
    removeAllWatchLater: (state) => {
      state.watchLaterMovies = {};
      state.watchLaterMovieIds = [];
    },
  },
});

export default watchLaterSlice;
