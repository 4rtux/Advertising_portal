import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchResultPage from './pages/SearchResultPage';
import MyListingPage from './pages/MyListingPage';
import CreateListingPage from './pages/CreateListingPage';
import ListingPerformancePage from './pages/ListingPerformancePage';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/search/:keyword" element={<SearchResultPage />} />
        {/* Protected Route Below */}
        <Route path="/account/my-listings" element={<MyListingPage />} />
        <Route path="/account/create-listing" element={<CreateListingPage />} />
        <Route path="/account/view-listing/:id" element={<ListingPerformancePage />} />
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
