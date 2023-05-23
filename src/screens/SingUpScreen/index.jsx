import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utils/firebase';
import './index.css';

function SignUpScreen({ email }) {
  const [formError, setFormError] = useState(null);

  const emailRef = useRef(email);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const validateForm = (email, password) => {
    // Validate email using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.match(emailRegex)) {
      setFormError('Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      setFormError('Password should be at least 6 characters');

      return false;
    }
    return true;
  };

  const register = (e) => {
    e.preventDefault();
    const emailValue = emailRef.current.value;
    const passwordValue = passwordRef.current.value;

    if (!validateForm(emailValue, passwordValue)) return;

    createUserWithEmailAndPassword(auth, emailValue, passwordRef.current.value)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        if (user) navigate('/');
      })
      .catch((error) => {
        setFormError('Wrong email or password');
      });
  };

  const signIn = (e) => {
    e.preventDefault();
    const emailValue = emailRef.current.value;
    const passwordValue = passwordRef.current.value;

    if (!validateForm(emailValue, passwordValue)) return;
    signInWithEmailAndPassword(auth, emailValue, passwordValue)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        if (user) navigate('/');
      })
      .catch((error) => {
        setFormError('Wrong email or password');
      });
  };

  return (
    <div className='signUpScreen'>
      <form>
        <h1>Sign In</h1>
        <input ref={emailRef} defaultValue={email} type='email' placeholder='Email' name='email' id='email' required />
        <input ref={passwordRef} type='password' placeholder='Password' name='password' id='password' required />
        <p className='error-alert' role='alert'>
          {formError || ''}
        </p>

        <button type='submit' onClick={signIn} data-testid='sign-in'>
          Sign In
        </button>
        <h4>
          <span className='signUpScreen__gray'>New to Netflix? </span>
          <span className='signUpScreen__link' onClick={register}>
            Sign up now.
          </span>
        </h4>
      </form>
    </div>
  );
}

export default SignUpScreen;
