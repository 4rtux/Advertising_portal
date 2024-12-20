
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const ListingPerformancePage = () => {
  const token = Cookies.get('userToken');
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // fetch data from API
    fetch(`http://localhost:4000/v1/user/listing/${id}`,
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
        setListing(data.data);
      }
    });
  }, [id, token]);

  const deleteListing = () => {
    if(confirm('Are you sure you want to delete this listing?')){
      fetch(`http://localhost:4000/v1/user/delete-listing/${id}`,
      {
        method: 'DELETE',
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
          alert('Listing deleted successfully');
          navigate('/account/my-listings');
        }
      });
    }
  }
  return (
  <div>
    <Navbar />
    <div className="container mt-4">
      <div className='row'>
        <div className='col-md-8 row'>
          {
            listing?.pictures?.map((image, index) => (
              <div className='col-4' key={index}>
                <img src={image} alt={listing?.name} className='img-fluid' />
              </div>
            ))
          }
          <div className='col-12'>
            <h3>{listing?.name} [{listing?.type}]</h3>
            <h4>{listing?.category_id} - {listing?.price} PLN</h4>
            <h4>Favorites:{listing?.category_id} - Views:{listing?.price} PLN</h4>
            <p>{listing?.description}</p>
          </div>
        </div>
        <div className='col-md-4'>
          <button className="btn btn-lg btn-primary my-2">Edit</button><br />
          <button className="btn btn-lg btn-dark my-2">Sold</button><br />
          <button className="btn btn-lg btn-danger my-2" onClick={deleteListing}>Delete</button><br />
          <button className="btn btn-lg btn-success my-2">Promote</button><br />
        </div>
      </div>
    </div>
    <Footer />
  </div>
)
};

export default ListingPerformancePage;
