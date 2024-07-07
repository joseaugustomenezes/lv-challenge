import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import watchLaterSlice from '../data/watchLaterSlice';
import Movie from './Movie';
import '../styles/starred.scss';
import { HOME } from '../routes';

const WatchLater = () => {
  const { watchLaterMovies, watchLaterMovieIds } = useSelector(
    (state) => state.watchLater,
  );

  const dispatch = useDispatch();

  const { removeAllWatchLater } = watchLaterSlice.actions;

  return (
    <div className="starred" data-testid="watch-later-div">
      {watchLaterMovieIds.length > 0 && (
        <div data-testid="watch-later-movies" className="starred-movies">
          <h6 className="header">Watch Later List</h6>
          <div className="row">
            {watchLaterMovieIds.map((movieId) => (
              <Movie movie={watchLaterMovies[movieId]} key={movieId} />
            ))}
          </div>

          <footer className="text-center">
            <button
              className="btn btn-primary"
              onClick={() => dispatch(removeAllWatchLater())}
            >
              Empty list
            </button>
          </footer>
        </div>
      )}

      {watchLaterMovieIds.length === 0 && (
        <div className="text-center empty-cart">
          <i className="bi bi-heart" />
          <p>You have no movies saved to watch later.</p>
          <p>
            Go to <Link to={HOME}>Home</Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default WatchLater;
