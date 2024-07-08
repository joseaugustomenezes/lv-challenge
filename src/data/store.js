import { configureStore } from '@reduxjs/toolkit';
import moviesSlice from './moviesSlice';
import starredSlice from './starredSlice';
import watchLaterSlice from './watchLaterSlice';
import selectedTrailerSlice from './selectedTrailerSlice';

const store = configureStore({
  reducer: {
    movies: moviesSlice.reducer,
    starred: starredSlice.reducer,
    watchLater: watchLaterSlice.reducer,
    selectedTrailer: selectedTrailerSlice.reducer,
  },
});

export default store;
