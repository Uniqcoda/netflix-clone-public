import React from 'react';
import NetflixLogo from '../../assets/Netflix-logo.png';
import './index.css';

function LoadingSpinner() {
  return (
    <div className='loadingSpinner'>
      <img
        src={NetflixLogo}
        alt='loading'
        className='loadingSpinner__logo'
      />
      <div className='spinner'></div>
    </div>
  );
}

export default LoadingSpinner;
