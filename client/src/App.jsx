import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="relative min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans overflow-x-hidden selection:bg-indigo-500 selection:text-white">
          {/* Subtle Ambient Background Gradients */}
          <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
            <div className="absolute -top-40 right-10 w-96 h-96 bg-indigo-200/35 rounded-full blur-3xl" />
            <div className="absolute top-60 -left-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl" />
          </div>

          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Dashboard />} />
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
