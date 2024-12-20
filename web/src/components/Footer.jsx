
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-light text-center py-3 mt-5">
    <p>© 2024 AdPortal. All rights reserved. | <a href="#terms">Terms</a> | <a href="#privacy">Privacy</a> <Link to="/admin/register">Admin Register</Link> <Link to="/admin/login">Admin Login</Link></p>
  </footer>
);

export default Footer;
