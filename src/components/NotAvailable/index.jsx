import React from 'react';
import './index.css';

export default function NotAvailable({ type }) {
  return (
    <h1 className='notAvailable'>
      No {type || 'movies'} available for the selected genre. Please select a different genre.
    </h1>
  );
}
