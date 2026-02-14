import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const auth = useContext(AuthContext);
    const user = auth?.user;
    const isLoading = auth?.isLoading;

    if (isLoading) return <div className="flex-1 flex items-center justify-center text-white">Loading Security...</div>;

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
