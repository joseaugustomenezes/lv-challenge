import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import starredSlice from '../data/starredSlice';
import Movie from './Movie';
import '../styles/starred.scss';
import { HOME } from '../routes';

const Starred = () => {
  const { starredMovies, starredMovieIds } = useSelector(
    (state) => state.starred,
  );

  const dispatch = useDispatch();

  const { clearAllStarred } = starredSlice.actions;

  return (
    <div className="starred" data-testid="starred">
      {starredMovieIds.length > 0 && (
        <div data-testid="starred-movies" className="starred-movies">
          <h6 className="header">Starred movies</h6>
          <div className="row">
            {starredMovieIds.map((movieId) => (
              <Movie movie={starredMovies[movieId]} key={movieId} />
            ))}
          </div>

          <footer className="text-center">
            <button
              className="btn btn-primary"
              onClick={() => dispatch(clearAllStarred())}
            >
              Remove all starred
            </button>
          </footer>
        </div>
      )}

      {starredMovieIds.length === 0 && (
        <div className="text-center empty-cart">
          <i className="bi bi-star" />
          <p>There are no starred movies.</p>
          <p>
            Go to <Link to={HOME}>Home</Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default Starred;
