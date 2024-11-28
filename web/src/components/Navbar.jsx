
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <div className="container-fluid">
      <Link to="/" className="navbar-brand">
        <img src="/src/assets/logo.png" alt="Logo" height="40" />
      </Link>
      <div className="d-flex ms-auto">
        <Link to="/register" className="btn btn-primary me-2">Register</Link>
        <Link to="/login" className="btn btn-secondary">Login</Link>
      </div>
    </div>
  </nav>
);

export default Navbar;
