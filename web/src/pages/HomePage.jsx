import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import Categories from '../components/Categories';
import FeaturedListings from '../components/FeaturedListings';
import Footer from '../components/Footer';
import Cookies from 'js-cookie';

const HomePage = () => {
  
  const token = Cookies.get('userToken');
  const [listings, setListings] = useState([]);
  console.log(listings)
  useEffect(() => {

    fetch(`http://localhost:4000/v1/main/listings`,
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
          setListings(data.data.listings);
          console.log({data})
        }
      });
  },[]);

  return (
  <div>
    <Navbar />
    <div className="container mt-4">
      <SearchBar />
      <Categories />
      <FeaturedListings title="Featured Listings" data={listings} />
      {/* <FeaturedListings title="Promoted Items" data={[]} /> */}
    </div>
    <Footer />
  </div>
)
};

export default HomePage;
