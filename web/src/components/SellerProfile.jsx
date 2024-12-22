import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie'; 

const SellerProfile = ({sellerProfile}) =>{ 
  const token = Cookies.get('userToken');
  const [showReviewForm, setShowReviewForm] = React.useState(false);
  const [showReportForm, setShowReportForm] = React.useState(false);
  const [rating, setRating] = React.useState(1);
  const [review, setReview] = React.useState('');
  const [report, setReport] = React.useState('');

  const submitReport = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/v1/user/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          report,userID:sellerProfile.id
        }),
      });

      const data = await response.json();

      if (data.status) {
        alert('Report sent successfully!');
        setReport('');
        setShowReportForm(false);
      } else {
        alert(data.data.message || 'Failed to report user');
      }
    } catch (error) {
      console.error('Error reporting user:', error);
      alert('An error occurred during reporting user.');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/v1/user/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          star:rating, message:review,userID:sellerProfile.id
        }),
      });

      const data = await response.json();

      if (data.status) {
        alert('Review sent successfully!');
        setRating(1);
        setReview('');
        setShowReviewForm(false);
      } else {
        alert(data.data.message || 'Failed to review user');
      }
    } catch (error) {
      console.error('Error reviewing user:', error);
      alert('An error occurred during reviewing user.');
    }
  };

  if (!sellerProfile) {
    return <div>Loading...</div>;
  }

  return (  
  <div className="col-md-3">
    <h3>Seller Details</h3>
    <h4>{sellerProfile.first_name} {sellerProfile.last_name}</h4>
    <h4>{sellerProfile.location}</h4>
    <h4>{sellerProfile.phone}</h4>
    <h4>{sellerProfile.email}</h4>
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
    <button className='btn btn-danger' onClick={()=>setShowReportForm(!showReportForm)}>Report Seller</button>
    <button className='btn btn-success mx-2' onClick={()=>setShowReviewForm(!showReviewForm)}>Review Seller</button>
    <form onSubmit={submitReport} style={{display:showReportForm?'block':'none'}}>
      <div className="mb-3">
        <label htmlFor="report" className="form-label">Reason for Report</label>
        <textarea
          className="form-control"
          id="report"
          value={report}
          onChange={(e) => setReport(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">Submit Report</button>
    </form>
    <form onSubmit={submitReview} style={{display:showReviewForm?'block':'none'}}>
      <div className="mb-3">
        <label htmlFor="review" className="form-label">Rating</label>
        <select
          className="form-control"
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="review" className="form-label">Review</label>
        <textarea
          className="form-control"
          id="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">Submit Review</button>
    </form>
  </div>
)
};
// Add PropTypes validation
SellerProfile.propTypes = {
  sellerProfile: PropTypes.any
};

export default SellerProfile;
