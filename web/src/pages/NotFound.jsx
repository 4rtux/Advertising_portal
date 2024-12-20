// src/pages/NotFound.js
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const NotFound = () => {
    return (
        <div>
            <Navbar />
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h1>404</h1>
                <p>Oops! The page you're looking for doesn't exist.</p>
                <Link to="/">Go back to Home</Link>
            </div>
        </div>
    );
};

export default NotFound;
