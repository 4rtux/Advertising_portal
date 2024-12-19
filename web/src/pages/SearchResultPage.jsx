
import React from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import Categories from '../components/Categories';
import FeaturedListings from '../components/FeaturedListings';
import Footer from '../components/Footer';
import SellerProfile from '../components/SellerProfile';
import ProductItem from '../components/ProductItem';
import { useParams } from 'react-router-dom';

const SearchResultPage = () => {
  const { keyword } = useParams();
  return (
  <div>
    <Navbar />
    <div className="container mt-4">
      <div>
        <h3>Search Results for "{keyword}"</h3>
      </div>
      <div>
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
      </div>
    </div>
    <Footer />
  </div>
)
};

export default SearchResultPage;
