import React, { useContext, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, token, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            console.log("There is no token set")
            navigate('/login');
        }
    }, [token, navigate]);

    return children;
};

export default PrivateRoute;