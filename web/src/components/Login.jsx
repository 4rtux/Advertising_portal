import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { setUser } from '../redux/slices/userSlice';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userIdentifier, setUserIdentifier] = useState(''); // Can be username or email
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/v1/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: userIdentifier, // Allow either username or email
          password,
        }),
      });

      const data = await response.json();

      if (data.status) {
        alert('Login successful!');
        // Save token in cookies
        Cookies.set('userToken', data.data.token, { expires: 7 });
        Cookies.set('logged', "user", { expires: 7 });
        // Dispatch user data to Redux
        dispatch(setUser(data.data.user));
        navigate('/'); 
      } else {
        alert(data.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred during login.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="p-3 border rounded">
        <div className="mb-3">
          <label htmlFor="userIdentifier" className="form-label">Username or Email</label>
          <input
            type="text"
            className="form-control"
            id="userIdentifier"
            value={userIdentifier}
            onChange={(e) => setUserIdentifier(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default Login;
