import React, { useState } from 'react';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/userSlice';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateInput = () => {
    const newErrors = {};

    // Regex patterns
    const nameRegex = /^[A-Za-z]+$/;
    const usernameRegex = /^[A-Za-z0-9_]{3,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/;
    const passwordRegex = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/;

    // First name
    if (!nameRegex.test(firstName)) {
      newErrors.firstName = 'First name must only contain letters.';
    }

    // Last name
    if (!nameRegex.test(lastName)) {
      newErrors.lastName = 'Last name must only contain letters.';
    }

    // Username
    if (!usernameRegex.test(username)) {
      newErrors.username = 'Username must be 3-15 characters long and contain only letters, numbers, and underscores.';
    }

    // Email
    if (!emailRegex.test(email)) {
      newErrors.email = 'Email must be a valid format (e.g., user@example.com).';
    }

    // Phone
    if (!phoneRegex.test(phone)) {
      newErrors.phone = 'Phone number may include a prefix (e.g., +123 123456789) and no more than 17 numbers long.';
    }

    // Password
    if (!passwordRegex.test(password)) {
      newErrors.password = 'Password must contain 1 number, 1 uppercase, 1 lowercase, and must be 8 characters or longer with no spaces.';
    }

    // Confirm password
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInput()) {
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/v1/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          username,
          email,
          phone,
          password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await response.json();

      if (data.status) {
        alert('Registration successful!');
        Cookies.set('userToken', data.data.token, { expires: 7 });
        Cookies.set('logged', "user", { expires: 7 });
        // Dispatch user data to Redux
        dispatch(setUser(data.data.user));
        navigate('/'); 
      } 
      else {
        alert(data.data.message || 'Registration failed');
      }
    }
    catch (error) {
      console.error('Error registering:', error);
      alert('An error occurred during registration.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
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
          {errors.firstName && <div className="text-danger">{errors.firstName}</div>}
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
          {errors.lastName && <div className="text-danger">{errors.lastName}</div>}
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
          {errors.username && <div className="text-danger">{errors.username}</div>}
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
          {errors.email && <div className="text-danger">{errors.email}</div>}
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
          {errors.phone && <div className="text-danger">{errors.phone}</div>}
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
          {errors.password && <div className="text-danger">{errors.password}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default Register;
