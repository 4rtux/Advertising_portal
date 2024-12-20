
import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

const ProductItem = ({listing, views, favorites}) => {
  const token = Cookies.get('userToken');

  const submitFavorite = async () => {
    if (confirm('Are you sure you want to add this listing to favorite?')) {
      try {
        fetch(`http://localhost:4000/v1/user/add-favorite/${listing.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => response.json())
        .then(data => {
          if (data.status) {
            alert('Listing added to favorite successfully!');
          } else {
            alert(data.data.message || 'Failed to add listing to favorite');
          }
        })
        .catch(error => {
          console.error('Error making listing a favorite:', error);
          alert('An error occurred during adding the listing to favorite.');
        });

      } catch (error) {
        console.error('Error reporting user:', error);
        alert('An error occurred during reporting user.');
      }
    }
  };

  return (

  <div className="col-md-9">
    <h2>{listing.name}</h2>
    <div className='row'>
      {
          listing?.pictures?.map((picture, index) => (
            <div className="col-md-4" key={index}>
              <img className="d-block w-100" src={picture} alt="First slide" />
            </div>
          ))
        }
    </div>
    {/* <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
      <div className="carousel-inner">
        {
          listing.pictures.map((picture, index) => (
            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
              <img className="d-block w-100" src={picture} alt="First slide" />
            </div>
          ))
        }
      </div>
      <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="sr-only">Previous</span>
      </a>
      <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="sr-only">Next</span>
      </a>
    </div> */}
    {/* <img src="https://via.placeholder.com/250" className="card-img-top" alt="Listing" /> */}
    <p>
      {listing.description}<br/><br/>
      <strong>Category: {listing.category}</strong><br/>
      <strong>Price: {listing.price}</strong><br/>
      <strong>type: {listing.type}</strong><br/>
    </p>
    <strong>Views: {views}</strong> <strong>Favorite: {favorites}</strong><br/>
    <buttom className="btn btn-success" onClick={()=>submitFavorite()}>Favorite this</buttom> 
  </div>
)
};

// Add PropTypes validation
ProductItem.propTypes = {
  listing: PropTypes.any.isRequired,
  views: PropTypes.number.isRequired,
  favorites: PropTypes.number.isRequired,
};
export default ProductItem;
