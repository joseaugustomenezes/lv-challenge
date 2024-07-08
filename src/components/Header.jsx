import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import '../styles/header.scss';
import { HOME, STARRED, WATCH_LATER } from '../routes';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from '../util/useDebounce';

const Header = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(searchQuery);
  const navigate = useNavigate();
  const { starredMovieIds } = useSelector((state) => state.starred);
  const debouncedQuery = useDebounce(searchInput, 500);
  const debouncedQueryRef = useRef(debouncedQuery);

  useEffect(() => {
    if (debouncedQueryRef.current !== debouncedQuery) {
      debouncedQueryRef.current = debouncedQuery;
      navigate(debouncedQuery ? `${HOME}?search=${debouncedQuery}` : HOME);
      window.scrollTo(0, 0);
    }
  }, [debouncedQuery, navigate]);

  return (
    <header>
      <Link to={HOME} data-testid="home" onClick={() => setSearchInput('')}>
        <i className="bi bi-film" />
      </Link>

      <nav>
        <NavLink to={STARRED} data-testid="nav-starred" className="nav-starred">
          {starredMovieIds.length > 0 ? (
            <>
              <i className="bi bi-star-fill bi-star-fill-white" />
              <sup className="star-number">{starredMovieIds.length}</sup>
            </>
          ) : (
            <i className="bi bi-star" />
          )}
        </NavLink>
        <NavLink to={WATCH_LATER} className="nav-fav">
          watch later
        </NavLink>
      </nav>

      <div className="input-group rounded search-link">
        <input
          type="search"
          data-testid="search-movies"
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          value={searchInput}
          className="form-control rounded"
          placeholder="Search movies..."
          aria-label="Search movies"
          aria-describedby="search-addon"
        />
      </div>
    </header>
  );
};

export default Header;
