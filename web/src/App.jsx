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
import ProtectedRoute from './components/ProtectedRoute';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import ProfilePage from './pages/ProfilePage';
import MyFavoriteListingsPage from './pages/MyFavoriteListingsPage';
import AdminRegisterPage from './pages/AdminRegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminProfilePage from './pages/AdminProfilePage';
import AdminUserPage from './pages/AdminUserPage';



const App = () => {
  function createOrder() {
    return fetch("/my-server/create-paypal-order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        // use the "body" param to optionally pass additional order information
        // like product ids and quantities
        body: JSON.stringify({
            cart: [
                {
                    id: "YOUR_PRODUCT_ID",
                    quantity: "YOUR_PRODUCT_QUANTITY",
                },
            ],
        }),
    })
        .then((response) => response.json())
        .then((order) => order.id);
}
function onApprove(data) {
      return fetch("/my-server/capture-paypal-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderID: data.orderID
        })
      })
      .then((response) => response.json())
      .then((orderData) => {
            const name = orderData.payer.name.given_name;
            alert(`Transaction completed by ${name}`);
      });

    }
    
    return (
      // <PayPalScriptProvider options={{ clientId: "Af-P5E1G40gSI82238V4bT3txlGd__CsemFiOZ-tW4Jk-PRjqAInaYnIbv8Y0ddkdDHwbTm_9Q5AUVvA" }}>
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/listing/:id" element={<ProductPage />} />
                <Route path="/search/:keyword" element={<SearchResultPage />} />
                {/* Protected Routes */}
                <Route
                    path="/account/create-listing"
                    element={
                        <ProtectedRoute>
                            <CreateListingPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/account/my-listings"
                    element={
                        <ProtectedRoute>
                            <MyListingPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/account/view-listing/:id"
                    element={
                        <ProtectedRoute>
                            <ListingPerformancePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/account/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                />
                <Route
                    path="/account/favorites"
                    element={
                      <ProtectedRoute>
                        <MyFavoriteListingsPage />
                      </ProtectedRoute>
                    }
                />
                <Route path="/admin/register" element={<AdminRegisterPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route
                    path="/admin/create-category"
                    element={
                      <AdminProtectedRoute>
                        <MyFavoriteListingsPage />
                      </AdminProtectedRoute>
                    }
                />
                <Route
                    path="/admin/dashboard"
                    element={
                      <AdminProtectedRoute>
                        <AdminDashboardPage />
                      </AdminProtectedRoute>
                    }
                />
                <Route
                    path="/admin/profile"
                    element={
                      <AdminProtectedRoute>
                        <AdminProfilePage />
                      </AdminProtectedRoute>
                    }
                />
                <Route
                    path="/admin/user/:userID"
                    element={
                      <AdminProtectedRoute>
                        <AdminUserPage />
                      </AdminProtectedRoute>
                    }
                />

                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
        //     <PayPalButtons
        //         createOrder={createOrder}
        //         onApprove={onApprove}
        //     />
        // </PayPalScriptProvider>
    );
};

export default App;
