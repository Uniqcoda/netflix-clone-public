import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSearch, FaRegBell, FaCaretDown } from 'react-icons/fa';
import NetflixLogo from '../../assets/Netflix-logo.png';
import NetflixAvatar from '../../assets/Netflix-avatar.png';

import './index.css';

function Nav() {
  const [showDark, setShowDark] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [inputHover, setInputHover] = useState(false);

  const navigate = useNavigate();

  const links = [
    { name: 'Home', link: '/' },
    { name: 'TV Shows', link: '/tv' },
    { name: 'Movies', link: '/movies' },
    // { name: 'New & Popular', link: '/' },
    { name: 'My List', link: '/mylist' },
  ];

  const transitionNavBar = () => {
    if (window.scrollY > 100) {
      setShowDark(true);
    } else {
      setShowDark(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', transitionNavBar);

    // add a clean up function that will run after updating the DOM
    return () => window.removeEventListener('scroll', transitionNavBar);
  }, []);

  return (
    <nav className={`nav ${showDark && 'nav__black'}`}>
      <div className='nav__left'>
        <div className='nav__brand'>
          <img
            src={NetflixLogo}
            onClick={() => {
              navigate('/');
            }}
            alt=''
            className='nav__logo'
          />
        </div>
        <ul className='nav_links'>
          {links.map(({ name, link }) => (
            <li key={name}>
              <Link to={link}>{name}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className='nav__right'>
        <div className={`nav__search ${showSearch ? 'show-search' : ''}`}>
          <button
            onFocus={() => setShowSearch(true)}
            onBlur={() => {
              if (!inputHover) setShowSearch(false);
            }}
          >
            <FaSearch />
          </button>
          <input
            type='text'
            placeholder='Search'
            onMouseEnter={() => setInputHover(true)}
            onMouseLeave={() => setInputHover(false)}
            onBlur={() => {
              setShowSearch(false);
              setInputHover(false);
            }}
          />
        </div>
        <div className='nav__notifications'>
          <FaRegBell title='Notifications'/>
        </div>
        <div
          className='nav__avatar'
          onClick={() => {
            navigate('/profile');
          }}
        >
          <span>
            <img src={NetflixAvatar} alt='' />
          </span>
          <span>
            <FaCaretDown title='View profile'/>
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
