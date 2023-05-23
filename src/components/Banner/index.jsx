import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import axios from 'axios';
import NetflixBanner from '../../assets/Netflix-banner.png';
import { API_KEY, TMDB_BASE_URL } from '../../utils/constants';
import './index.css';

function Banner() {
  const [movie, setMovie] = useState();

  const navigate = useNavigate();

  const truncate = (string, n) => {
    return string?.length > n ? string.substr(0, n - 1) + '...' : string;
  };

  useEffect(() => {
    // Create a cancel token source
    const source = axios.CancelToken.source();

    const fetchData = async () => {
      try {
        const request = await axios.get(`${TMDB_BASE_URL}/discover/tv?api_key=${API_KEY}&with_networks=213`, {
          cancelToken: source.token,
        });
        const movies = request.data.results;
        setMovie(movies[Math.floor(Math.random() * movies.length - 1)]);
        return request;
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      // Cancel the request when the component unmounts or when the request is no longer needed
      source.cancel('Request canceled by cleanup');
    };
  }, []);

  return (
    <div
      className='banner'
      style={{
        backgroundImage: `${
          movie ? `url('https://image.tmdb.org/t/p/original${movie?.backdrop_path}')` : `url(${NetflixBanner})`
        }`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }}
    >
      <div className='banner__contents'>
        <h1 className='banner__title'>
          {movie?.name || movie?.title || movie?.original_title || movie?.original_name || 'Movie Title'}
        </h1>
        <div className='banner__buttons'>
          <button className='banner__button' onClick={() => navigate('/player')}>
            <FaPlay title='Play movie' />
            Play
          </button>
          <button className='banner__button'>
            <AiOutlineInfoCircle title='More info' />
            More Info
          </button>
        </div>
        <h2 className='banner__description'>{truncate(movie?.overview, 150) || 'Movie description'}</h2>
      </div>
      <div className='banner--fadeBottom' />
    </div>
  );
}

export default Banner;
