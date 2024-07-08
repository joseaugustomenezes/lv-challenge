import { useEffect } from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import 'reactjs-popup/dist/index.css';
import { fetchMovies } from './data/moviesSlice';
import { ENDPOINT_SEARCH, ENDPOINT_DISCOVER } from './constants';
import Header from './components/Header';
import Movies from './components/Movies/Movies';
import Starred from './components/Starred';
import WatchLater from './components/WatchLater';
import './app.scss';
import { HOME, STARRED, WATCH_LATER } from './routes';
import TrailerModal from './components/TrailerModal/TrailerModal';

const App = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const dispatch = useDispatch();

  useEffect(() => {
    if (searchQuery !== '') {
      dispatch(
        fetchMovies({
          apiUrl: `${ENDPOINT_SEARCH}${searchQuery}`,
          fetchType: 'search',
          searchedTerm: searchQuery,
        }),
      );
    } else {
      dispatch(
        fetchMovies({ apiUrl: ENDPOINT_DISCOVER, fetchType: 'discover' }),
      );
    }
  }, [searchQuery, dispatch]);

  return (
    <div className="App">
      <Header />
      <div className="container">
        <Routes>
          <Route path={HOME} element={<Movies />} />
          <Route path={STARRED} element={<Starred />} />
          <Route path={WATCH_LATER} element={<WatchLater />} />
          <Route
            path="*"
            element={<h1 className="not-found">Page Not Found</h1>}
          />
        </Routes>
      </div>
      <TrailerModal />
    </div>
  );
};

export default App;
