import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PrivateRoute({ children }) {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        // If the user is not logged in, redirect them to the login page.
        // Save the current location they were trying to go to, so we can redirect them back after login.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If the user is logged in, render the component they were trying to access.
    return children;
}
