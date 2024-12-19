
import React, { useState } from 'react';

const SearchBar = () =>{ 
  const [search, setSearch] = useState('');

  const visitSearchPage = () => {
    window.location.href = `/search/${search}`;
  }

  return (
  <div className="input-group mb-4">
    <input type="text" className="form-control" placeholder="Search for ads..." value={search} onChange={(e)=>{setSearch(e.target.value)}} />
    <button className="btn btn-primary" onClick={visitSearchPage}>Search</button>
  </div>
)};

export default SearchBar;
