
import React from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import Categories from '../components/Categories';
import FeaturedListings from '../components/FeaturedListings';
import Footer from '../components/Footer';
import AccountNavbar from '../components/AccountNavbar';
import CreateListing from '../components/CreateListing';

const CreateListingPage = () => (
  <div>
    <AccountNavbar />
    <CreateListing />
    <Footer />
  </div>
);

export default CreateListingPage;
