import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
} from 'lucide-react';

import { UserRole } from '../types/invite.types';
import { useGetInvitesQuery } from '../features/inviteApi';

const ManageInvitesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetInvitesQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'ALL'>('ALL');

  const invites = data?.data || [];

  const filteredInvites = invites.filter((invite) => {
    const matchesSearch = invite.email
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || invite.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getStatusBadge = (invite: any) => {
    if (invite.acceptedAt) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3" />
          Accepted
        </span>
      );
    }

    const isExpired = new Date(invite.expiresAt) < new Date();
    if (isExpired) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3" />
          Expired
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  };

  const getRoleBadge = (role: UserRole) => {
    const colors = {
      [UserRole.ADMIN]: 'bg-blue-100 text-blue-800',
      [UserRole.MANAGER]: 'bg-green-100 text-green-800',
      [UserRole.STAFF]: 'bg-purple-100 text-purple-800',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colors[role]}`}
      >
        {role}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
            <button
              onClick={() => navigate('/invite')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Invitation
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Invitations
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage all user invitations
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative sm:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="ALL">All Roles</option>
                <option value={UserRole.ADMIN}>Admin</option>
                <option value={UserRole.MANAGER}>Manager</option>
                <option value={UserRole.STAFF}>Staff</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Loading invitations...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-red-600">
              Failed to load invitations
            </div>
          ) : filteredInvites.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No invitations found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Expires At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvites.map((invite) => (
                    <tr
                      key={invite.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {invite.email}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">{getRoleBadge(invite.role)}</td>
                      <td className="py-4 px-4">{getStatusBadge(invite)}</td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(invite.expiresAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageInvitesPage;