import React, { useState, useRef } from 'react';
import NetflixLogo from '../../assets/Netflix-logo.png';
import SingUpScreen from '../SingUpScreen';

import './index.css';

function LoginScreen() {
  const [signIn, setSignIn] = useState(false);
  const [email, setEmail] = useState(null);
  const emailRef = useRef(null);

  const validateEmail = (email) => {
    // Validate email using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.match(emailRegex)) {
      alert('Please enter a valid email address');
      return false;
    }
    return true;
  };
  const loadForm = (e) => {
    e.preventDefault();
    const emailValue = emailRef.current.value;
    if (!validateEmail(emailValue)) return;
    setEmail(() => emailValue);
    setSignIn(true);
  };

  return (
    <div className='loginScreen'>
      <div className='loginScreen__background'>
        <img data-testid='company-logo' src={NetflixLogo} alt='' className='loginScreen__logo' />
        {/* Sign In Nav Button */}
        {!signIn && (
          <button className='loginScreen__button' onClick={() => setSignIn(true)}>
            Sign In
          </button>
        )}

        <div className='loginScreen__gradient'></div>
      </div>
      <div className='loginScreen__body'>
        {signIn ? (
          <SingUpScreen email={email} />
        ) : (
          <>
            <h1>Unlimited films, TV programmes and more.</h1>
            <h2>Watch anywhere. Cancel at any time.</h2>
            <h3>Ready to watch? Enter your email to create or restart your membership.</h3>
            <div className='loginScreen__input'>
              <form>
                <input ref={emailRef} type='email' placeholder='Email' name='email' required />
                <button className='loginScreen__getStarted' onClick={loadForm}>
                  GET STARTED
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginScreen;
