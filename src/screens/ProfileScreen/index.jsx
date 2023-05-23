import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Nav from '../../components/Nav';
import Plans from '../../components/Plans';
import NetflixAvatar from '../../assets/Netflix-avatar.png';
import { selectUser } from '../../store/userSlice';
import { auth } from '../../utils/firebase';

import './index.css';

function ProfileScreen() {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const signOut = () => {
    auth.signOut();
    navigate('/login');
  };

  return (
    <div className='profileScreen'>
      <Nav />
      <div className='profileScreen__body'>
        <h1>Edit Profile</h1>
        <div className='profileScreen__info'>
          <img src={NetflixAvatar} alt='' />
          <div className='profileScreen__details'>
            <h2>{user.email}</h2>
            <div className='profileScreen__plans'>
              <h3>Plans</h3>
              <Plans />
              <button onClick={signOut} className='profileScreen__signOut'>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileScreen;
