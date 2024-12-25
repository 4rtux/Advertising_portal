
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearUser, setUser } from '../redux/slices/userSlice';
import Cookies from 'js-cookie';

const AdminNavbar = () => {
  const token = Cookies.get('userToken');
  const logged = Cookies.get('logged');

  let { user } = useSelector((state) => state.user);
  const [userData, setUserData] = React.useState(user);
  const [show, toggleShow] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  if(!user && token){
    fetch('http://localhost:4000/v1/administrator/verify-token', {
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

  console.log("logged: ",logged, userData)
  return (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <div className="container-fluid">
      <Link to="/" className="navbar-brand">
        <img src="/src/assets/logo.png" alt="Logo" height="40" />
      </Link>
      <div className="d-flex ms-auto">
        {userData ? (
          <>
          <div className={`dropdown ${show?'show':''}`}>
            <button onClick={()=>toggleShow(!show)} className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Admin Account
            </button>
            <div className={`dropdown-menu ${show?'show':''}`} aria-labelledby="dropdownMenuButton">
              <Link to="/admin/dashboard" className="dropdown-item">Dashboard</Link>
              <Link to="/admin/profile" className="dropdown-item">profile</Link>
              <a className="dropdown-item" href="#" onClick={logoutUser} >Logout</a>
            </div>
            
          </div>
          <h3 className="mx-5">{userData.username}</h3>
          </>
        )
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

export default AdminNavbar;
