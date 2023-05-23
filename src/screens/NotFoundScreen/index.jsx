import React from 'react';
import { Link } from 'react-router-dom';

import './index.css';

function NotFoundPage() {
  return (
    <div className='notFound'>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <p>
        Go to the <Link to='/'>homepage</Link>.
      </p>
    </div>
  );
}

export default NotFoundPage;
