import { createSlice } from '@reduxjs/toolkit';

const starredSlice = createSlice({
  name: 'starred',
  initialState: {
    starredMovies: {},
    starredMovieIds: [],
  },
  reducers: {
    starMovie: (state, action) => {
      if (!state.starredMovies[action.payload.id]) {
        state.starredMovies[action.payload.id] = action.payload;
        state.starredMovieIds.push(action.payload.id);
      }
    },
    unstarMovie: (state, action) => {
      delete state.starredMovies[action.payload.id];
      state.starredMovieIds = state.starredMovieIds.filter(
        (id) => id !== action.payload.id,
      );
    },
    clearAllStarred: (state) => {
      state.starredMovies = {};
      state.starredMovieIds = [];
    },
  },
});

export default starredSlice;
