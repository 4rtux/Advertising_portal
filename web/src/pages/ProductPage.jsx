
import React from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import Categories from '../components/Categories';
import FeaturedListings from '../components/FeaturedListings';
import Footer from '../components/Footer';
import SellerProfile from '../components/SellerProfile';
import ProductItem from '../components/ProductItem';
import { useParams } from 'react-router-dom';
const sellerProfile = {
  id:1,
  name:"Gambito",
  location:"Gliwice",
  contact:"+4812345678",
  ratings:"4.5",
  reviews:[
    {
      name:"Papito",
      message:"He is a nice seller"
    },
    {
      name:"Klaudia",
      message:"He is legit"
    }
  ]

}
const ProductPage = () => {
  const { id } = useParams();
  return (
  <div>
    <Navbar />
    <div className="container mt-4">
      {/* <SearchBar /> */}
      {/* <Categories /> */}
      {/* <h3>{id}</h3> */}
      <div className='row'>
        <ProductItem />
        <SellerProfile sellerProfile={sellerProfile} />
      </div>
      <FeaturedListings title="More From seller" />
      <FeaturedListings title="Similar Product" />
    </div>
    <Footer />
  </div>
)
};

export default ProductPage;
