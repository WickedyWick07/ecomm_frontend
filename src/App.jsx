import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/SignUp';
import Profile from './components/Profile';
import ProductList from './components/ProductList';
import PrivateRoute from './components/ProtectedRoutes';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/CheckOut';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from './components/Home';


function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
        <div className="App">
          <div className="container mt-4">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/products" element={<PrivateRoute><ProductList /></PrivateRoute>} />
                <Route path="/products/:pk/" element={<PrivateRoute><ProductDetail /></PrivateRoute>} />
                <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
                <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
              </Routes>
            </div>
        </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
