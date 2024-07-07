import { createSlice } from '@reduxjs/toolkit';

const selectedTrailerSlice = createSlice({
  name: 'selectedTrailer',
  initialState: {
    selectedTrailerKey: undefined,
  },
  reducers: {
    setSelectedTrailerKey: (state, action) => {
      state.selectedTrailerKey = action.payload;
    },
    clearSelectedTrailerKey: (state) => {
      state.selectedTrailerKey = undefined;
    },
  },
});

export default selectedTrailerSlice;
