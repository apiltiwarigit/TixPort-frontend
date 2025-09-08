'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  UsersIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon
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
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const token = localStorage.getItem('auth_session');
      
      if (!token) return;

      const session = JSON.parse(token);
      const response = await fetch(`${API_BASE}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
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
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.last_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const token = localStorage.getItem('auth_session');
      
      if (!token) return;

      const session = JSON.parse(token);
      const response = await fetch(`${API_BASE}/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        await fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating user role:', error);
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
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <UserPlusIcon className="h-5 w-5" />
          Add User
        </button>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                            <UsersIcon className="h-6 w-6 text-gray-300" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {user.first_name && user.last_name 
                              ? `${user.first_name} ${user.last_name}`
                              : user.email
                            }
                          </div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role || 'user'}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="owner">Owner</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-400 hover:text-blue-300 mr-3">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="text-red-400 hover:text-red-300">
                        <TrashIcon className="h-4 w-4" />
                      </button>
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
    </div>
  );
}
