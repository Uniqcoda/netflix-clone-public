import React from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import video from '../../assets/video1.mp4';

import './index.css';

function Player() {
  const navigate = useNavigate();

  return (
    <div>
      <div className='player'>
        <div className='back'>
          <BsArrowLeft onClick={() => navigate(-1)} />
        </div>
        <video src={video} autoPlay loop controls muted />
      </div>
    </div>
  );
}

export default Player;
