import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Home,
  BookOpen,
  Settings,
  LogOut,
  UserPlus,
  Users,
  Shield,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

import { logout } from '../features/auth/authSlice';
import { UserRole } from '../types/invite.types';
import { useAppDispatch } from '../app/hook';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* User Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome, {user?.name}!
              </h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 mb-1">Role</p>
              <p className="text-lg font-semibold text-blue-700 capitalize">
                {user?.role || 'User'}
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-medium text-green-900 mb-1">Status</p>
              <p className="text-lg font-semibold text-green-700 capitalize">
                {user?.status || 'Active'}
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm font-medium text-purple-900 mb-1">
                Account Type
              </p>
              <p className="text-lg font-semibold text-purple-700">Standard</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Admin Only Cards */}
          {isAdmin && (
            <>
              <button
                onClick={() => navigate('/invite')}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all cursor-pointer text-left group"
              >
                <div className="flex items-center justify-between mb-3">
                  <UserPlus className="w-10 h-10 text-blue-600 group-hover:scale-110 transition-transform" />
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Invite User
                </h3>
                <p className="text-gray-600 text-sm">
                  Send invitations to new team members
                </p>
              </button>

              <button
                onClick={() => navigate('/invites/manage')}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all cursor-pointer text-left group"
              >
                <div className="flex items-center justify-between mb-3">
                  <Users className="w-10 h-10 text-green-600 group-hover:scale-110 transition-transform" />
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Manage Invites
                </h3>
                <p className="text-gray-600 text-sm">
                  View and manage all pending invitations
                </p>
              </button>
            </>
          )}

          {/* General User Cards */}
          {/* <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Home className="w-10 h-10 text-purple-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Getting Started
            </h3>
            <p className="text-gray-600 text-sm">
              Explore the features and set up your profile.
            </p>
          </div> */}

          {/* <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <BookOpen className="w-10 h-10 text-orange-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Resources
            </h3>
            <p className="text-gray-600 text-sm">
              Access documentation and support materials.
            </p>
          </div> */}

          {/* <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Settings className="w-10 h-10 text-indigo-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Settings
            </h3>
            <p className="text-gray-600 text-sm">
              Customize your account preferences.
            </p>
          </div> */}
        </div>

        {/* Admin Notice */}
        {isAdmin && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-semibold text-blue-900 mb-2">
                  Administrator Access
                </h4>
                <p className="text-blue-800 text-sm">
                  You have administrator privileges. You can invite new users,
                  manage invitations, and access all system features.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;