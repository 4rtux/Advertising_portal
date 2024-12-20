import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const FeaturedListings = ({ title, data }) => {
  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <div className="row my-3">
      <h3 className="mb-4">{title}</h3>
      {
        [...data].map((listing, index) => (
            <div className="col-md-4" key={index}>
              <Link to={`/listing/${listing.id}`} style={{textDecoration:"none"}}>
                <div className="card">
                  <img src={listing.pictures[0]} className="card-img-top" alt="Listing" style={{height:"400px"}} />
                  <div className="card-body">
                    <h5 className="card-title">{listing.name}</h5>
                    <p className="card-text">PLN {listing.price}</p>
                  </div>
                </div>
                </Link>
              </div>
        ))
      }
    </div>
  );
};

// Add PropTypes validation
FeaturedListings.propTypes = {
  title: PropTypes.string.isRequired, // Ensure 'title' is a required string
  data: PropTypes.any.isRequired, // Allow any type for 'data'
};

export default FeaturedListings;
