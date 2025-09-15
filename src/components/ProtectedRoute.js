// Protected route component to restrict access to authenticated users only
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  
  // Redirect to home if user is not authenticated
  return currentUser ? children : <Navigate to="/" />;
}
