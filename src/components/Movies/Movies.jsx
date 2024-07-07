import Movie from '../Movie';
import '../../styles/movies.scss';
import { useDispatch, useSelector } from 'react-redux';
import './Movies.css';
import { useEffect, useRef } from 'react';
import { fetchMovies } from '../../data/moviesSlice';
import { ENDPOINT_DISCOVER, ENDPOINT_SEARCH } from '../../constants';
import { useSearchParams } from 'react-router-dom';

const Movies = () => {
  const {
    movies,
    fetchStatus,
    lastFetchType,
    lastFetchPage,
    totalPages,
    movieIds,
  } = useSelector((state) => state.movies);
  const loader = useRef(null);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [searchQuery]);

  useEffect(() => {
    let loaderValue;
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('search');

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && lastFetchPage < totalPages) {
          if (lastFetchType === 'search') {
            dispatch(
              fetchMovies({
                apiUrl: `${ENDPOINT_SEARCH}${searchQuery}&page=${lastFetchPage + 1}`,
                fetchType: 'search',
                searchedTerm: searchQuery,
              }),
            );
          } else {
            dispatch(
              fetchMovies({
                apiUrl: `${ENDPOINT_DISCOVER}&page=${lastFetchPage + 1}`,
                fetchType: 'discover',
              }),
            );
          }
        }
      },
      {
        root: null,
        rootMargin: '20px',
      },
    );

    if (loader.current) {
      observer.observe(loader.current);
      loaderValue = loader.current;
    }

    return () => {
      if (loaderValue) {
        observer.unobserve(loaderValue);
      }
    };
  }, [lastFetchType, movies, lastFetchPage, totalPages, dispatch]);

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
