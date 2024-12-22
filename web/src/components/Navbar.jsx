
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearUser, setUser } from '../redux/slices/userSlice';
import Cookies from 'js-cookie';

const Navbar = () => {
  const token = Cookies.get('userToken');
  const logged = Cookies.get('logged');

  let { user } = useSelector((state) => state.user);
  const [userData, setUserData] = React.useState(user);
  const [show, toggleShow] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  if(!user && token){
    fetch('http://localhost:4000/v1/user/verify-token', {
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
        setUserData(data.data);
        dispatch(setUser(data.data));
      }
    });
  }

  const logoutUser = () => {
    if(confirm('Are you sure you want to logout?')){
      // Remove user token from cookies
      Cookies.remove('userToken');
      // Remove user data from Redux
      dispatch(clearUser());
      // navigate('/');
      window.location.href = '/';
    }

  } 

  const companyNameStyle = {
    fontFamily: 'Coolvetica, sans-serif',
    fontSize: '2rem',
    color: '#000',
    marginLeft: '15px',
  };

  const logoStyle = {
    marginBottom: '10px',
  };

  console.log("logged: ",logged, userData)
  return (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <div className="container-fluid">
      <Link to="/" className="navbar-brand">
        <img src="./src/assets/logo.png" alt="Logo" height="40" style={logoStyle}/>
        <span style={companyNameStyle}>Comercify</span>
      </Link>
      <div className="d-flex ms-auto">
        {userData ? 
            <div className={`dropdown-menu ${show?'show':''}`} aria-labelledby="dropdownMenuButton">
              <Link to="/account/create-listing" className="dropdown-item">Create Listing</Link>
              <Link to="/account/my-listings" className="dropdown-item">My Listings</Link>
              <Link to="/account/profile" className="dropdown-item">Profile</Link>
              <Link to="/account/favorites" className="dropdown-item">Favorites</Link>
              <a className="dropdown-item" href="#" onClick={logoutUser} >Logout</a>
            </div>
        :
        <>
          <Link to="/register" className="btn btn-primary me-2">Register</Link>
          <Link to="/login" className="btn btn-secondary">Login</Link>
        </>
        }
      </div>
    </div>
  </nav>
)};

export default Navbar;
