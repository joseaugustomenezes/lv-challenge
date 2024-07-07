import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import selectedTrailerSlice from '../../data/selectedTrailerSlice';
import YouTubePlayer from '../YoutubePlayer';
import './TrailerModal.css';

const TrailerModal = () => {
  const { selectedTrailerKey, fetchStatus } = useSelector(
    (state) => state.selectedTrailer,
  );
  const { clearSelectedTrailerKey } = selectedTrailerSlice.actions;
  const dispatch = useDispatch();

  const onClose = () => dispatch(clearSelectedTrailerKey());

  if (!fetchStatus && !selectedTrailerKey) return <></>;

  const bodyByFetchStatus = {
    error: <p>Error fetching the trailer.</p>,
    loading: <p>Loading...</p>,
    success: <YouTubePlayer videoKey={selectedTrailerKey} />,
  };

  return (
    <div className="modal-background" onClick={onClose}>
      <div className="modal-foreground" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          X
        </button>
        {bodyByFetchStatus[fetchStatus]}
      </div>
    </div>
  );
};

export default TrailerModal;
