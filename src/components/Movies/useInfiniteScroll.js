import { useEffect, useRef } from 'react';
import { fetchMovies } from '../../data/moviesSlice';
import { ENDPOINT_DISCOVER, ENDPOINT_SEARCH } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';

const useInfiniteScroll = () => {
  const loader = useRef(null);
  const dispatch = useDispatch();
  const { movies, lastFetchType, lastFetchPage, totalPages } = useSelector(
    (state) => state.movies,
  );

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

  return { loader };
};

export default useInfiniteScroll;
