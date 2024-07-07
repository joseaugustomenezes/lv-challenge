import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import selectedTrailerSlice from '../../data/selectedTrailerSlice';
import YouTubePlayer from '../YoutubePlayer';
import './TrailerModal.css';

const TrailerModal = () => {
  const { selectedTrailerKey } = useSelector((state) => state.selectedTrailer);
  const { clearSelectedTrailerKey } = selectedTrailerSlice.actions;
  const dispatch = useDispatch();

  const onClose = () => dispatch(clearSelectedTrailerKey());

  if (!selectedTrailerKey) return <></>;

  return (
    <div className="modal-background" onClick={onClose}>
      <div className="modal-foreground" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          X
        </button>
        <YouTubePlayer videoKey={selectedTrailerKey} />
      </div>
    </div>
  );
};

export default TrailerModal;
