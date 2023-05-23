import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Banner from '../../components/Banner';
import Nav from '../../components/Nav';
import Slider from '../../components/Slider';
import { fetchMovies, getGenres } from '../../store';

import './index.css';

function HomeScreen() {
  const movies = useSelector((state) => state.netflix.movies);
  const genres = useSelector((state) => state.netflix.genres);
  const genresLoaded = useSelector((state) => state.netflix.genresLoaded);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGenres());
  }, [dispatch]);

  useEffect(() => {
    if (genresLoaded) {
      dispatch(fetchMovies({ genres, type: 'all' }));
    }
  }, [dispatch, genres, genresLoaded]);

  return (
    <div className='homeScreen'>
      <Nav />
      <Banner />
      <div className='homeScreen__slider'>
        <Slider movies={movies} />
      </div>
    </div>
  );
}

export default HomeScreen;
