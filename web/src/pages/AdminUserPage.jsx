import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const AdminUserPage = () => {
  const { userID } = useParams();
  const token = Cookies.get('userToken');
  const [userStatus, setUserStatus] = useState(0);
  const [sellerProfile, setSellerProfile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:4000/v1/administrator/restrict-user/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: userStatus,
        userID,
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (!data.status) {
        alert(data.data.message);
        return;
      }
      else{
        alert('User status updated successfully');
      }
    });
  }

  useEffect(() => {
    // fetch data from API
    fetch(`http://localhost:4000/v1/administrator/view-user/${userID}`,
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
        return;
      }    
      else{
        console.log(data.data);
        // setCategories(data.data.categories);
        // setUsers(data.data.users);
        setSellerProfile(data.data);
        // setUserStatus(data.data.seller.status);
      }
    });
    // setMyListings(data)
  }, []);


  const interpreteStatus = (status) => {
    switch(status){
      case 0:
        return 'Sold';
      case 1:
        return 'Active';
      case 2:
        return 'Removed By Admin';
      default:
        return 'Unknown';
    }
  }

  if(!sellerProfile) return <div>Loading...</div>

  return (
    <div> 
      <AdminNavbar />      
      <div className="container mt-4">
        <div className='row'>
          <div className='col-md-8'>

              <h4>User Listings</h4>
              <div className="card" >
                <div className="card-header">
                {sellerProfile?.user?.first_name}'s Listings
                </div>
                <div className="card-body">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">Title</th>
                        <th scope="col">Type</th>
                        <th scope="col">Price</th>
                        <th scope="col">Category</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellerProfile.sellerListings.map((listing) => (
                        <tr key={listing.id}>
                          <td>{listing.name}</td>
                          <td>{listing.type}</td>
                          <td>{listing.price}</td>
                          <td>{listing.category}</td>
                          <td><span className=''>{interpreteStatus(listing.status)}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <h4 className='mt-5'>User Reviews</h4>
              <div className="card" >
                <div className="card-header">
                  {sellerProfile.user.first_name}'s Reviews
                </div>
                
                <div className="card-body">
                  
                  <strong>Average Rating: {sellerProfile.ratings}</strong>                    
                  {
                    [...sellerProfile.reviews].map(review=>(
                      <>
                        <strong>{review.name}</strong><br/>
                        <small>{review.message}</small>
                        <hr/>
                      </>
                    ))
                  }
                </div>
              </div>
          </div>

          <div className="col-md-4">
            <h4>User Profile</h4>
            <div className="card" >
              <div className="card-header">
              {sellerProfile.user.first_name}'s Profile
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Fullname: {sellerProfile.user.first_name} {sellerProfile.user.last_name}</li>
                <li className="list-group-item">Username: {sellerProfile.user.username}</li>
                <li className="list-group-item">Email: {sellerProfile.user.email}</li>
                <li className="list-group-item">Phone: {sellerProfile.user.phone}</li>
                <li className="list-group-item">Location: {sellerProfile.user.location}</li>
              </ul>
              
            </div>
            <div className="card mt-4">
              <div className='card-body'>
                <form onSubmit={handleSubmit} className='mb-5'>
                  <div className="mb-3">
                    <label htmlFor="user-status" className="form-label">Ban User</label>
                    <select className="form-control" id="user-status" value={userStatus} onChange={(e) => setUserStatus(e.target.value)}>
                      <option value='-1'>Restrict from the platform</option>
                      <option value='0'>Restrict from Posting new Listings</option>
                      <option value='1'>Activate account</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">Update User Status</button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
};

export default AdminUserPage;
