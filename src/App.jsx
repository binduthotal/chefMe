import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

import LoginPage from './components/LoginPage';
import Register from './components/Register';
import Home from './components/Home';

// 1. Wrapper to protect the Dashboard/Home
const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    // If not logged in, redirect to login page and replace the history state
    return <Navigate to="/login" replace />;
  }
  return children;
};

// 2. Wrapper to prevent logged-in users from seeing the Login/Register pages
const PublicRoute = ({ user, children }) => {
  if (user) {
    // If already logged in, redirect to home and replace the history state
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthChecking(false); // Stop loading once we know their status
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Show a blank screen or a loading spinner while Firebase checks the user's status
  // This prevents the login page from flashing for a split second when a logged-in user refreshes the Home page.
  if (isAuthChecking) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>; 
  }

  return (
    <Router>
      <Routes>
        {/* Wrap Login and Register in PublicRoute */}
        <Route 
          path="/login" 
          element={
            <PublicRoute user={user}>
              <LoginPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute user={user}>
              <Register />
            </PublicRoute>
          } 
        />
        
        {/* Wrap Home in ProtectedRoute */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute user={user}>
              <Home />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;