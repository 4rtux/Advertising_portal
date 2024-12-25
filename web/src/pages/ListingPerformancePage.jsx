
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { PaystackButton } from 'react-paystack';



const ListingPerformancePage = () => {
  const token = Cookies.get('userToken');
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [promotionData, setPromotionData] = useState({user_id:0, listing_id:id, plan_id:1, days:0, amount:0});
  const navigate = useNavigate();

  // you can call this function anything
  const handlePaystackSuccessAction = (reference) => {
    // Implementation for whatever you want to do with reference and after success call.
    console.log(reference);
    console.log("paid",{promotionData});

    fetch(`http://localhost:4000/v1/user/promote-listing`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(promotionData),
    })
    .then(response => response.json())
    .then(data => {
      if (!data.status) {
        alert(data.data.message);
        return;
      }    
      else{
        alert('Listing promoted successfully');
        // navigate('/account/my-listings');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });

  };

  const soldProduct = () => {
    if(confirm('Are you sure you want to mark this listing as sold?')){
      fetch(`http://localhost:4000/v1/user/sold-listing/${id}`,
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
          alert('Listing marked as sold successfully');
          // navigate('/account/my-listings');
        }
      });
    }
  }
  // you can call this function anything
  const handlePaystackCloseAction = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log('closed')
    alert('Payment closed');
  }

  const config = {
    reference: (new Date()).getTime().toString(),
    email: "user@example.com",
    amount: promotionData.amount * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: 'pk_test_c40bce9f5b6907c0c4d2c27935d8680f601efee1',
    // currency: 'USD',
  };

  const componentProps = {
    ...config,
    text: 'Promote Listing',
    onSuccess: (reference) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
    className: "btn btn-success btn-lg btn-block",
  };

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
        setPromotionData({...promotionData, user_id: data.data.user_id});
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

  const plans = [
    {id: 1, days: 7, amount: 500, name: '7 days for 500 NGN(Regular)'},
    {id: 2, days: 7, amount: 600, name: '7 days for 600 NGN(Pro)'},
    {id: 3, days: 14, amount: 750, name: '14 days for 750 NGN(Regular)'},
    {id: 4, days: 14, amount: 800, name: '14 days for 800 NGN(Pro)'},
    {id: 5, days: 30, amount: 1250, name: '30 days for 1250 NGN(Regular)'},
    {id: 6, days: 30, amount: 1300, name: '30 days for 1300 NGN(Pro)'},    
  ]

  const changePromotionPlan = (value) => {
    const plan = plans.find(plan => plan.id == value);
    setPromotionData({...promotionData, plan_id: value, days: plan.days, amount: plan.amount}); 
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
            <h3>{listing?.name} - {listing?.price} PLN</h3>
            <h4>{listing?.type} - {listing?.category}</h4>
            <h4>Favorites:{listing?.favorites} - Views:{listing?.views}</h4>
            <p>{listing?.description}</p>
          </div>
        </div>
        <div className='col-md-4'>
          <div className="btn-group" role="group" aria-label="Basic example">
            <button type="button" className="btn btn-dark" onClick={()=>soldProduct()}>Sold</button>
            <button type="button" className="btn btn-danger" onClick={deleteListing}>Delete</button>
          </div>
          
          <div className="card mt-3" >
              <div className="card-header">
                Promotion Status
              </div>

              <ul className="list-group list-group-flush">
                <li className="list-group-item">promotion Label: {listing?.promo?.promotionLabel}</li>
                <li className="list-group-item">Start Date: {listing?.promo?.start}</li>
                <li className="list-group-item">End Date: {listing?.promo?.expire}</li>
                <li className="list-group-item">Plan Type:
                  {
                    plans.map((plan, index) => {
                      if(plan.id == listing?.promo?.plan_id){
                        return <option key={index} value={plan.id}>{plan.name}</option>
                      } 
                    })
                  }
                </li>
              </ul>
            </div>

          <div className='card-body'>
            <form  className='my-5'>
              <div className="mb-3">
                <h3 htmlFor="user-status" className="form-label">Promote Listing</h3>
                <select className="form-control" id="user-status" value={promotionData.plan_id} onChange={(e) => changePromotionPlan(e.target.value)}>
                  {
                    plans.map((plan, index) => (
                      <option key={index} value={plan.id}>{plan.name}</option>
                    ))
                  }
                </select>
              </div>
            </form>
            <PaystackButton {...componentProps} />
          </div>
        </div> 
      </div>
    </div>
    <Footer />
  </div>
)
};

export default ListingPerformancePage;
