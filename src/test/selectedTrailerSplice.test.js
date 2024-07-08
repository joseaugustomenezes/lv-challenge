import selectedTrailerSlice, {
  fetchTrailer,
} from '../data/selectedTrailerSlice';

describe('SelectedTrailerSlice test', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      selectedTrailerKey: undefined,
      fetchStatus: '',
    };
  });

  it('should set loading true while action is pending', () => {
    const action = { type: fetchTrailer.pending };
    const result = selectedTrailerSlice.reducer(initialState, action);
    expect(result).toEqual({ ...initialState, fetchStatus: 'loading' });
  });

  it('should update state when action is fulfilled', () => {
    const action = {
      type: fetchTrailer.fulfilled,
      payload: '123',
    };
    const result = selectedTrailerSlice.reducer(initialState, action);

    expect(result).toEqual({
      selectedTrailerKey: '123',
      fetchStatus: 'success',
    });
  });

  it('should set error when action is rejected', () => {
    const action = { type: fetchTrailer.rejected };
    const result = selectedTrailerSlice.reducer(initialState, action);
    expect(result).toEqual({ ...initialState, fetchStatus: 'error' });
  });
});
