import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthContext from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateRecipe from './pages/CreateRecipe';
import EditRecipe from './pages/EditRecipe';
import RecipeDetails from './pages/RecipeDetails';
import Profile from './pages/Profile';

import './App.css';

function App() {
  return (
    <AuthContext>
      <Router>
        <Navbar />
        <main className="app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route path="/create" element={<ProtectedRoute><CreateRecipe /></ProtectedRoute>} />
            <Route path="/edit/:id" element={<ProtectedRoute><EditRecipe /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </main>
      </Router>
    </AuthContext>
  );
}

export default App;
