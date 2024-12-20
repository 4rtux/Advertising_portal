
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import Categories from '../components/Categories';
import FeaturedListings from '../components/FeaturedListings';
import Footer from '../components/Footer';
import SellerProfile from '../components/SellerProfile';
import ProductItem from '../components/ProductItem';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
// const sellerProfile = {
//   id:1,
//   name:"Gambito",
//   location:"Gliwice",
//   contact:"+4812345678",
//   ratings:"4.5",
//   reviews:[
//     {
//       name:"Papito",
//       message:"He is a nice seller"
//     },
//     {
//       name:"Klaudia",
//       message:"He is legit"
//     }
//   ]

// }
const ProductPage = () => {
  const { id } = useParams();
  const token = Cookies.get('userToken');
  const [listing, setListing] = useState([]);
  const [sellerListing, setSellerListing] = useState([]);
  const [relatedListing, setRelatedListing] = useState([]);
  const [sellerProfile, setSellerProfile] = useState(null);
  const [sellerReviews, setSellerReviews] = useState([]);
  const [views, setViews] = useState(0);
  const [favorites, setFavorites] = useState(0);

  useEffect(() => {
    console.log("goiung to fetch")
    fetch(`http://localhost:4000/v1/main/listing/${id}`,
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
          console.log(data.data);
          setListing(data.data.listing);
          setSellerProfile(data.data.seller);
          setSellerListing(data.data.sellerListings);
          setRelatedListing(data.data.relatedListings);
          setFavorites(data.data.favorites);
          setViews(data.data.views);
        }
      });
  },[id, token]);
  return (
  <div>
    <Navbar />
    <div className="container mt-4">
      {/* <SearchBar /> */}
      {/* <Categories /> */}
      {/* <h3>{id}</h3> */}
      <div className='row'>
        <ProductItem listing={listing} views={views} favorites={favorites} />
        <SellerProfile sellerProfile={sellerProfile} />
      </div>
      <FeaturedListings title="More From seller" data={sellerListing} />
      <FeaturedListings title="Similar Product" data={relatedListing} />
    </div>
    <Footer />
  </div>
)
};

export default ProductPage;
