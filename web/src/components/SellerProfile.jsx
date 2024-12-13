
import React from 'react';

const SellerProfile = ({sellerProfile}) => (  
  <div className="col-md-3">
    <h3>Seller's Details</h3>
    <h4>{sellerProfile.name}</h4>
    <h4>{sellerProfile.location}</h4>
    <h4>{sellerProfile.contact}</h4>
    <h4>Rating: {sellerProfile.ratings}</h4>
    <h4>Reviews</h4>
    {
      [...sellerProfile.reviews].map(review=>(
        <>
          <strong>{review.name}</strong><br/>
          <small>{review.message}</small>
          <hr/>
        </>
      ))
    }
    <button className='btn btn-danger'>Report Seller</button>
  </div>
);

export default SellerProfile;
