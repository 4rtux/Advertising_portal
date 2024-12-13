
import React from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import Categories from '../components/Categories';
import FeaturedListings from '../components/FeaturedListings';
import Footer from '../components/Footer';

const HomePage = () => (
  <div>
    <Navbar />
    <div className="container mt-4">
      <SearchBar />
      <Categories />
      <FeaturedListings title="Featured Listings" />
      <FeaturedListings title="Promoted Items" />
    </div>
    <Footer />
  </div>
);

export default HomePage;
