import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoPlayCircleSharp } from 'react-icons/io5';
import { AiOutlinePlus } from 'react-icons/ai';
import { BsHandThumbsUp, BsHandThumbsDown } from 'react-icons/bs';
import { BiChevronDown } from 'react-icons/bi';
import { BsCheck } from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../store/userSlice';
import { removeMovieFromLiked, addToLikes } from '../../store';
import video from '../../assets/video.mp4';
import './index.css';

function Card({ movieData, isLiked = false }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  return (
    <div className='movieCard' onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <img src={`https://image.tmdb.org/t/p/w500${movieData.image}`} alt='card' onClick={() => navigate('/player')} />

      {isHovered && (
        <div className='hover'>
          <div className='image-video-container'>
            <img
              src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
              alt='card'
              onClick={() => navigate('/player')}
            />
            <video src={video} autoPlay={true} loop muted onClick={() => navigate('/player')} type='video/mp4' />
          </div>
          <div className='info-container'>
            <h3 className='name' onClick={() => navigate('/player')}>
              {movieData.name}
            </h3>
            <div className='icons'>
              <div className='controls'>
                <IoPlayCircleSharp title='Play' onClick={() => navigate('/player')} />
                <BsHandThumbsUp title='Like' />
                <BsHandThumbsDown title='Dislike' />
                {isLiked ? (
                  <BsCheck
                    title='Remove from List'
                    onClick={() => dispatch(removeMovieFromLiked({ movieId: movieData.id, userId: user.uid }))}
                  />
                ) : (
                  <AiOutlinePlus
                    title='Add to my list'
                    onClick={() => dispatch(addToLikes({ movieData, userId: user.uid }))}
                  />
                )}
              </div>
              <div className='info'>
                <BiChevronDown title='More Info' />
              </div>
            </div>
            <div className='genres'>
              <ul>
                {movieData.genres.map((genre, index) => (
                  <li key={index}>{genre}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(Card);
