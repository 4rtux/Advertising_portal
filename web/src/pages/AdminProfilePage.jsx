import React, { useState } from 'react';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/slices/userSlice';
import AdminNavbar from '../components/AdminNavbar';

const AdminProfilePage = () => {
  const { user } = useSelector((state) => state.user);
  const token = Cookies.get('userToken');
  // const [userData, setUserData] = React.useState(user);
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [location, setLocation] = useState(user.location);
  const [phone, setPhone] = useState(user.phone);
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/v1/administrator/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          username,
          email,
          phone,
          location,
        }),
      });

      const data = await response.json();

      if (data.status) {
        alert('Profile updated successful!');
      } 
      else {
        alert(data.data.message || 'Profile failed to update');
      }
    }
    catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred during updating profile.');
    }
  };


  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/v1/administrator/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (data.status) {
        alert('Password changed successful!');
      } 
      else {
        alert(data.data.message || 'Password changed failed');
      }
    }
    catch (error) {
      console.error('Error changing password:', error);
      alert('An error occurred during changing password.');
    }
  };
  return (

    <div>

      <AdminNavbar />
      <div className="container mt-5">
        <h2 className='mb-5'>Profile Page</h2>
        <div className="row">
          <div className="col-md-8">
            <h4>Edit Profile</h4>
            <form onSubmit={handleSubmit} className="p-3 border rounded">
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="location" className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Update Profile</button>
            </form>
            <h4 className="mt-5">Edit Security</h4>
            <form onSubmit={handleSubmitPassword} className="p-3 border rounded">
              <div className="mb-3">
                <label htmlFor="oldPassword" className="form-label">Old Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Update Security</button>
            </form>
          </div>
          <div className="col-md-4">
            <h4>Preview Profile</h4>
            <div className="card" >
              {/* <div className="card-header">
                Featured
              </div> */}
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Fullname: {firstName} {lastName}</li>
                <li className="list-group-item">Username: {username}</li>
                <li className="list-group-item">Email: {email}</li>
                <li className="list-group-item">Phone: {phone}</li>
                <li className="list-group-item">Location: {location}</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminProfilePage;
