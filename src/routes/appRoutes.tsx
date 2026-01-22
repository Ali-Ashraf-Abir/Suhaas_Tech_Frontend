import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';
import InviteUserPage from '../pages/InviteUserPage';
import { ProtectedRoute } from './protectedRoute';
import { AdminRoute } from './adminRoutes';
import ManageInvitesPage from '../pages/ManageInvitePage';


const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage />
          }
        />
        <Route
          path="/register/:token"
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <RegisterPage />
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invite"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <InviteUserPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/invites/manage"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <ManageInvitesPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;