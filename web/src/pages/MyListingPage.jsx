import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const MyListingPage = () => {
  const token = Cookies.get('userToken');
  const [myListings, setMyListings] = useState([]);
  let { user } = useSelector((state) => state.user);

  useEffect(() => {
    // fetch data from API
    fetch(`http://localhost:4000/v1/user/listings/${user.id}`,
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
        setMyListings(data.data);
      }
    });
    // setMyListings(data)
  }, [token, user.id, user]);

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
  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className='row'>
          <h3>My listings</h3>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Type</th>
                    <th scope="col">Price</th>
                    <th scope="col">Category</th>
                    <th scope="col">Status</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {myListings.map((listing) => (
                    <tr key={listing.id}>
                      <td>{listing.name}</td>
                      <td>{listing.type}</td>
                      <td>{listing.price}</td>
                      <td>{listing.category}</td>
                      <td><span className=''>{interpreteStatus(listing.status)}</span></td>
                      <td><Link to={`/account/view-listing/${listing.id}`} className="btn btn-success"> View</Link> </td>
                    </tr>
                  ))}
                </tbody>
              </table>
        </div>
      </div>
      <Footer />
    </div>
  )
};

export default MyListingPage;
