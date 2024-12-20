
import React from 'react';
import Register from '../components/Register';
import Navbar from '../components/Navbar';

const RegisterPage = () => {
  return (
    <div>

      <Navbar />
      <div className="`container mt-5">
        <Register />
      </div>
    </div>
  );
};

export default RegisterPage;
