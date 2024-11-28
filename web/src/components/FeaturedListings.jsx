
import React from 'react';

const FeaturedListings = () => (
  <div className="row">
    <h3 className="mb-4">Featured Listings</h3>
    <div className="col-md-4">
      <div className="card">
        <img src="https://via.placeholder.com/150" className="card-img-top" alt="Listing" />
        <div className="card-body">
          <h5 className="card-title">Smartphone</h5>
          <p className="card-text">$200</p>
        </div>
      </div>
    </div>
    <div className="col-md-4">
      <div className="card">
        <img src="https://via.placeholder.com/150" className="card-img-top" alt="Listing" />
        <div className="card-body">
          <h5 className="card-title">Used Car</h5>
          <p className="card-text">$5,000</p>
        </div>
      </div>
    </div>
    <div className="col-md-4">
      <div className="card">
        <img src="https://via.placeholder.com/150" className="card-img-top" alt="Listing" />
        <div className="card-body">
          <h5 className="card-title">Dining Table</h5>
          <p className="card-text">$300</p>
        </div>
      </div>
    </div>
  </div>
);

export default FeaturedListings;
