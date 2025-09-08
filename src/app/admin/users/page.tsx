'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  UsersIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  created_at?: string;
  last_sign_in_at?: string;
}

export default function AdminUsersPage() {
  const { user: currentUser, session, profile } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const accessToken = session?.access_token || (() => {
        try { return JSON.parse(localStorage.getItem('auth_session') || '{}')?.access_token; } catch { return undefined; }
      })();

      if (!accessToken) return;

      const response = await fetch(`${API_BASE}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers((data && data.data && Array.isArray(data.data.users)) ? data.data.users : []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    setIsRoleModalOpen(true);
  };

  const closeRoleModal = () => {
    setIsRoleModalOpen(false);
    setSelectedUser(null);
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      setIsUpdatingRole(true);
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const accessToken = session?.access_token || (() => {
        try { return JSON.parse(localStorage.getItem('auth_session') || '{}')?.access_token; } catch { return undefined; }
      })();

      if (!accessToken) {
        console.error('No auth token found');
        alert('Authentication required. Please log in again.');
        return;
      }

      const response = await fetch(`${API_BASE}/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        await fetchUsers(); // Refresh the list
        closeRoleModal();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Role update failed:', errorData);
        alert(`Failed to update role: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert(`Error updating role: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUpdatingRole(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <p className="text-gray-400 mt-2">Manage user accounts and roles</p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 mt-2">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Sign In</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.map((listedUser) => (
                  <tr key={listedUser.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                            <UsersIcon className="h-6 w-6 text-gray-300" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {listedUser.first_name && listedUser.last_name
                              ? `${listedUser.first_name} ${listedUser.last_name}`
                              : listedUser.email
                            }
                          </div>
                          <div className="text-sm text-gray-400">{listedUser.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-gray-700 text-white text-sm rounded">
                          {listedUser.role || 'user'}
                        </span>
                        {listedUser.role !== 'owner' && listedUser.id !== currentUser?.id && profile?.role === 'owner' && (
                          <button
                            onClick={() => openRoleModal(listedUser)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            Select Role
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {listedUser.created_at ? new Date(listedUser.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {listedUser.last_sign_in_at ? new Date(listedUser.last_sign_in_at).toLocaleDateString() : 'Never'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No users found</p>
        </div>
      )}

      {/* Role Change Modal */}
      {isRoleModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-96 max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Change User Role</h3>
              <button
                onClick={closeRoleModal}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-300 text-sm mb-2">User:</p>
              <p className="text-white font-medium">
                {selectedUser.first_name && selectedUser.last_name
                  ? `${selectedUser.first_name} ${selectedUser.last_name}`
                  : selectedUser.email
                }
              </p>
              <p className="text-gray-400 text-sm">{selectedUser.email}</p>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 text-sm mb-3">Select new role:</p>
              <div className="space-y-2">
                <button
                  onClick={() => updateUserRole(selectedUser.id, 'user')}
                  disabled={isUpdatingRole}
                  className={`w-full text-left px-4 py-2 rounded-lg border ${selectedUser.role === 'user'
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                    } ${isUpdatingRole ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  User
                </button>
                <button
                  onClick={() => updateUserRole(selectedUser.id, 'admin')}
                  disabled={isUpdatingRole}
                  className={`w-full text-left px-4 py-2 rounded-lg border ${selectedUser.role === 'admin'
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                    } ${isUpdatingRole ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Admin
                </button>
              </div>
              {isUpdatingRole && (
                <div className="mt-3 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-sm text-gray-400">Updating role...</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeRoleModal}
                disabled={isUpdatingRole}
                className={`px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 ${isUpdatingRole ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
