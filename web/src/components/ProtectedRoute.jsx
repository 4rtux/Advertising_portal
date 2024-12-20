import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/userSlice';

const ProtectedRoute = ({ children }) => {
    const token = Cookies.get('userToken');
    const dispatch = useDispatch();

    // console.log("token: ",Cookies.get('userToken'), "refreshToken: ",Cookies.get('refreshToken'))
    // console.log({token})

    // // Example backend verification request (optional)
    // // You can replace this with an actual API call to verify the token
    // // const isAuthenticated = token && verifyTokenWithBackend(token); // Replace with your logic
    // console.log({token}, verifyTokenWithBackend(token))
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    fetch('http://localhost:4000/v1/user/verify-token', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
    .then(response => response.json())
    .then(data => {
        // console.log({data})
        if (!data.status) {
            return <Navigate to="/login" replace />;
        }
        else{
            console.log("Fetched user data: ", data.data)
            dispatch(setUser(data.data));

            return children;
        }
    });
    // const result = await response.json();
    // if (!isAuthenticated) {
    //     return <Navigate to="/login" replace />;
    // }

    return children;
};

const verifyTokenWithBackend = async (token) => {
    try {
        const response = await fetch('http://localhost:4000/v1/user/verify-token', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        const result = await response.json();
        return result.isAuthenticated; // Adjust based on backend response
    } catch (error) {
        console.error('Token verification failed:', error);
        return false;
    }
};

export default ProtectedRoute;
