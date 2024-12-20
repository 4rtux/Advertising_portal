
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import FeaturedListings from '../components/FeaturedListings';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import SearchBar from '../components/SearchBar';

const SearchResultPage = () => {
  const token = Cookies.get('userToken');
  const [listings, setListings] = useState([]);
  const { keyword } = useParams();
  useEffect(() => {

    fetch(`http://localhost:4000/v1/main/search-listings/${keyword}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => response.json())
      .then(data => {
        if (!data.status) {
          alert(data.data.message);
          return;
        }    
        else{
          setListings(data.data);
          console.log({data})
        }
      });
  },[keyword, token]);
  return (
  <div>
    <Navbar />
    <div className="container mt-4">
      <div>
        <h3>Search Results for "{keyword}"</h3>
      </div>
      {/* <div className="mb-5">
        <form>
          <div className='row'>
            <div className='col-md-4'>
              <input type='text' className='form-control' placeholder='Search for products' />
            </div>
            <div className='col-md-2'>
              <select className='form-select'>
                <option value=''>Category</option>
              </select>
            </div>
            <div className='col-md-2'>
              <select className='form-select'>
                <option value=''>City</option>
              </select>
            </div>
            <div className='col-md-2'>
              <select className='form-select'>
                <option value=''>Type</option>
              </select>
            </div>
            <div className='col-md-2'>
              <button type="submit" className='btn btn-primary'>Search</button>
            </div>
          </div>
          
        </form>
      </div> */}

      <SearchBar />

      <FeaturedListings title="" data={listings} />
    </div>
    <Footer />
  </div>
)
};

export default SearchResultPage;
