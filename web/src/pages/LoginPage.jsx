
import React from 'react';
import Login from '../components/Login';
import Navbar from '../components/Navbar';

const LoginPage = () => {
  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h2>Login</h2>
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;
