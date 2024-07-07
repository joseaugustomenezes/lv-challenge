import Movie from '../Movie';
import '../../styles/movies.scss';
import { useSelector } from 'react-redux';
import './Movies.css';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useInfiniteScroll from './useInfiniteScroll';

const Movies = () => {
  const { movies, fetchStatus, movieIds } = useSelector(
    (state) => state.movies,
  );
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { loader } = useInfiniteScroll();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [searchQuery]);

  if (fetchStatus === 'error') {
    return <TextMessage message="Error fetching movies." />;
  }

  if (fetchStatus === 'loading' && movieIds.length === 0) {
    return <TextMessage message="Loading..." />;
  }

  return movieIds.length > 0 ? (
    <div data-testid="movies" className="movie-grid">
      {movieIds.map((id) => (
        <Movie
          className="movie-item"
          movie={movies[id]}
          key={id}
          ref={movieIds[movieIds.length - 1] === id ? loader : undefined}
        />
      ))}
      {fetchStatus === 'loading' && (
        <p style={{ margin: 'auto' }}>Loading...</p>
      )}
    </div>
  ) : (
    <TextMessage message="No movie was found." />
  );
};

const TextMessage = ({ message }) => (
  <p
    style={{
      width: '100%',
      margin: 'auto',
      fontSize: '30px',
    }}
  >
    {message}
  </p>
);

export default Movies;
