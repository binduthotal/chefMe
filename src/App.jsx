import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

import LoginPage from "./components/LoginPage";
import Register from "./components/Register";
import Home from "./components/Home";
import About from "./components/About";
import Dashboard from "./components/Dashboard";
import Recipes from "./components/Recipes";
import Profile from "./components/Profile";
import NotFound from "./components/NotFound";

const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ user, children }) => {
  if (user) return <Navigate to="/" replace />;
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthChecking(false); 
    });
    return () => unsubscribe();
  }, []);

  if (isAuthChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
   <Router>
      <Routes>
        <Route path="/login" element={<PublicRoute user={user}><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute user={user}><Register /></PublicRoute>} />
        <Route path="/about" element={<About />} />

        {/* --- PROTECTED LAYOUT & NESTED ROUTES --- */}
        <Route path="/" element={<ProtectedRoute user={user}><Home /></ProtectedRoute>}>
          
          {/* Default view when visiting "/" */}
          <Route index element={<Dashboard user={user} />} />
          
          {/* Nested URLs */}
          <Route path="recipes" element={<Recipes user={user} />} />
          <Route path="favorites" element={<Recipes user={user} filterFavorites={true} />} />
          <Route path="profile" element={<Profile user={user} />} />
          
          {/* Inline Shopping List placeholder (or extract to a component later!) */}
          <Route path="shopping-list" element={
            <div className="animate-in fade-in duration-300 flex flex-col items-center justify-center min-h-[400px] text-center bg-white/50 rounded-[32px] border border-white backdrop-blur-sm shadow-sm">
              <span className="text-5xl mb-4">🛒</span>
              <h3 className="text-2xl font-bold text-[#1B211A]">Shopping List</h3>
              <p className="text-[#1B211A]/70 mt-2">This feature is coming soon!</p>
            </div>
          } />
          
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;