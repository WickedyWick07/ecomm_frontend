import React, { createContext, useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      
    } else {
      delete api.defaults.headers.common['Authorization'];
    }


    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token ){
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
      } else {
        delete api.defaults.headers.common['Authorization'];
      }
      setLoading(false)
    }
    loadUser()
  }, []);

  

  const login = async (username, password) => {
    try {
      const response = await api.post('api/auth/login/', { username, password });
      console.log("Full login response:", response);
      if (response.data && response.data.key) {
        setToken(response.data.key);
        localStorage.setItem('token', response.data.key);
        api.defaults.headers.common['Authorization'] = `Token ${response.data.key}`;
        await fetchUser(); // We'll implement this function to get user data
        navigate('/products');
      } else {
        console.error("Invalid response structure:", response.data);
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error', error);
      throw error;
    }
  };
  
  const fetchUser = async () => {
    try {
      const response = await api.get('api/auth/user/');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data', error);
      logout();
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await api.post('api/auth/logout/', { refresh_token: refreshToken });
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      delete api.defaults.headers.common['Authorization'];
      navigate('/');
    }
  };

  useEffect(() => {
    if (token && !user) {
      fetchUser();
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };