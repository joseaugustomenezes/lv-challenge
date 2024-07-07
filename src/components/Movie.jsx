import { useDispatch, useSelector } from 'react-redux';
import starredSlice from '../data/starredSlice';
import watchLaterSlice from '../data/watchLaterSlice';
import selectedTrailerSlice from '../data/selectedTrailerSlice';
import placeholder from '../assets/not-found-500X750.jpeg';
import { ENDPOINT_MOVIE } from '../constants';
import { forwardRef } from 'react';

const Movie = forwardRef(({ movie, className }, ref) => {
  const { starredMovies } = useSelector((state) => state.starred);
  const { watchLaterMovies } = useSelector((state) => state.watchLater);
  const dispatch = useDispatch();

  const { starMovie, unstarMovie } = starredSlice.actions;
  const { setSelectedTrailerKey } = selectedTrailerSlice.actions;
  const { addToWatchLater, removeFromWatchLater } = watchLaterSlice.actions;

  const viewTrailer = async () => {
    const trailerKey = await getTrailerKey(movie.id);
    dispatch(setSelectedTrailerKey(trailerKey));
  };

  const getTrailerKey = async (id) => {
    const response = await fetch(ENDPOINT_MOVIE.replace('{id}', id));
    const videoData = await response.json();

    const videoResults = videoData.videos?.results || [];
    const trailer = videoResults.find((vid) => vid.type === 'Trailer');
    if (trailer) {
      return trailer.key;
    }
    return videoResults[0]?.key;
  };

  return (
    <div
      ref={ref}
      className={
        'wrapper col-3 col-sm-4 col-md-3 col-lg-3 col-xl-2 ' + className || ''
      }
    >
      <div className="card">
        <div className="card-body text-center">
          <div className="overlay" />
          <div className="info_panel">
            <div className="overview">{movie.overview}</div>
            <div className="year">{movie.release_date?.substring(0, 4)}</div>
            {!starredMovies[movie.id] ? (
              <span
                className="btn-star"
                data-testid="starred-link"
                onClick={() =>
                  dispatch(
                    starMovie({
                      ...movie,
                      release_date: movie.release_date?.substring(0, 4),
                    }),
                  )
                }
              >
                <i className="bi bi-star" />
              </span>
            ) : (
              <span
                className="btn-star"
                data-testid="unstar-link"
                onClick={() => dispatch(unstarMovie(movie))}
              >
                <i className="bi bi-star-fill" data-testid="star-fill" />
              </span>
            )}
            {!watchLaterMovies[movie.id] ? (
              <button
                type="button"
                data-testid="watch-later"
                className="btn btn-light btn-watch-later"
                onClick={() =>
                  dispatch(
                    addToWatchLater({
                      ...movie,
                      release_date: movie.release_date?.substring(0, 4),
                    }),
                  )
                }
              >
                Watch Later
              </button>
            ) : (
              <button
                type="button"
                data-testid="remove-watch-later"
                className="btn btn-light btn-watch-later blue"
                onClick={() => dispatch(removeFromWatchLater(movie))}
              >
                <i className="bi bi-check"></i>
              </button>
            )}
            <button
              type="button"
              className="btn btn-dark"
              onClick={viewTrailer}
            >
              View Trailer
            </button>
          </div>
          <img
            className="center-block"
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                : placeholder
            }
            alt="Movie poster"
          />
        </div>
        <h6 className="title mobile-card">{movie.title}</h6>
        <h6 className="title">{movie.title}</h6>
      </div>
    </div>
  );
});

Movie.displayName = 'Movie';

export default Movie;
