import React from 'react';
import { Link } from 'react-router-dom';

function SearchButton(props) {
  return (
    <div className='open-search'>
      <Link to='/search'>
        <button>Search</button>
      </Link>
    </div>
  );
}

export default SearchButton;
