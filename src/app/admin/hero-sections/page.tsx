'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  PhotoIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface HeroSection {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  primary_button_text?: string;
  primary_button_url?: string;
  secondary_button_text?: string;
  secondary_button_url?: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export default function AdminHeroSectionsPage() {
  const { user } = useAuth();
  const [heroSections, setHeroSections] = useState<HeroSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    image_url: '',
    primary_button_text: '',
    primary_button_url: '',
    secondary_button_text: '',
    secondary_button_url: '',
    display_order: 0,
    is_active: true,
  });
  const [selectedSection, setSelectedSection] = useState<HeroSection | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    image_url: '',
    primary_button_text: '',
    primary_button_url: '',
    secondary_button_text: '',
    secondary_button_url: '',
    display_order: 0,
    is_active: false,
  });

  useEffect(() => {
    fetchHeroSections();
  }, []);

  const fetchHeroSections = async () => {
    try {
      setLoading(true);
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const token = localStorage.getItem('auth_session');
      
      if (!token) return;

      const session = JSON.parse(token);
      const response = await fetch(`${API_BASE}/api/admin/hero-sections`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHeroSections(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching hero sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChange = (field: string, value: string | number | boolean) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const token = localStorage.getItem('auth_session');
      if (!token) return;

      const session = JSON.parse(token);
      const response = await fetch(`${API_BASE}/api/admin/hero-sections`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createForm),
      });

      if (response.ok) {
        setShowCreateForm(false);
        // reset form
        setCreateForm({
          title: '',
          description: '',
          image_url: '',
          primary_button_text: '',
          primary_button_url: '',
          secondary_button_text: '',
          secondary_button_url: '',
          display_order: 0,
          is_active: true,
        });
        await fetchHeroSections();
      }
    } catch (error) {
      console.error('Error creating hero section:', error);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const token = localStorage.getItem('auth_session');
      
      if (!token) return;

      const session = JSON.parse(token);
      const response = await fetch(`${API_BASE}/api/admin/hero-sections/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !isActive }),
      });

      if (response.ok) {
        await fetchHeroSections();
      }
    } catch (error) {
      console.error('Error updating hero section:', error);
    }
  };

  const deleteHeroSection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero section?')) return;

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const token = localStorage.getItem('auth_session');
      
      if (!token) return;

      const session = JSON.parse(token);
      const response = await fetch(`${API_BASE}/api/admin/hero-sections/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        await fetchHeroSections();
      }
    } catch (error) {
      console.error('Error deleting hero section:', error);
    }
  };

  const openView = (section: HeroSection) => {
    setSelectedSection(section);
    setShowViewModal(true);
  };

  const openEdit = (section: HeroSection) => {
    setSelectedSection(section);
    setEditForm({
      title: section.title || '',
      description: section.description || '',
      image_url: section.image_url || '',
      primary_button_text: section.primary_button_text || '',
      primary_button_url: section.primary_button_url || '',
      secondary_button_text: section.secondary_button_text || '',
      secondary_button_url: section.secondary_button_url || '',
      display_order: section.display_order ?? 0,
      is_active: !!section.is_active,
    });
    setShowEditForm(true);
  };

  const handleEditChange = (field: string, value: string | number | boolean) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSection) return;
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const token = localStorage.getItem('auth_session');
      if (!token) return;

      const session = JSON.parse(token);
      const response = await fetch(`${API_BASE}/api/admin/hero-sections/${selectedSection.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        setShowEditForm(false);
        setSelectedSection(null);
        await fetchHeroSections();
      }
    } catch (error) {
      console.error('Error saving hero section:', error);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Hero Sections</h1>
        <p className="text-gray-400 mt-2">Manage homepage hero content</p>
      </div>

      {/* Actions */}
      <div className="mb-6">
        <button
          onClick={() => { 
            setCreateForm({
              title: '',
              description: '',
              image_url: '',
              primary_button_text: '',
              primary_button_url: '',
              secondary_button_text: '',
              secondary_button_url: '',
              display_order: 0,
              is_active: true,
            });
            setShowCreateForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Create Hero Section
        </button>
      </div>

      {/* Hero Sections Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400 mt-2">Loading hero sections...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heroSections.map((section) => (
            <div key={section.id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              {section.image_url ? (
                <div className="aspect-video bg-gray-700 flex items-center justify-center">
                  <img
                    src={section.image_url}
                    alt={section.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-700 flex items-center justify-center">
                  <PhotoIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white truncate">{section.title}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(section.id, section.is_active)}
                      className={`px-2 py-1 text-xs rounded ${
                        section.is_active
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      {section.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>
                
                {section.description && (
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{section.description}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Order: {section.display_order}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openView(section)} className="text-blue-400 hover:text-blue-300">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button onClick={() => openEdit(section)} className="text-yellow-400 hover:text-yellow-300">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteHeroSection(section.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && heroSections.length === 0 && (
        <div className="text-center py-8">
          <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No hero sections found</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create your first hero section
          </button>
        </div>
      )}

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-white mb-4">Create Hero Section</h2>
            <form className="space-y-4" onSubmit={submitCreate}>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) => handleCreateChange('title', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => handleCreateChange('description', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                <input
                  type="url"
                  value={createForm.image_url}
                  onChange={(e) => handleCreateChange('image_url', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Primary Button Text</label>
                  <input
                    type="text"
                    value={createForm.primary_button_text}
                    onChange={(e) => handleCreateChange('primary_button_text', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Primary Button URL</label>
                  <input
                    type="text"
                    value={createForm.primary_button_url}
                    onChange={(e) => handleCreateChange('primary_button_url', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com or /category/sports"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Secondary Button Text</label>
                  <input
                    type="text"
                    value={createForm.secondary_button_text}
                    onChange={(e) => handleCreateChange('secondary_button_text', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Secondary Button URL</label>
                  <input
                    type="text"
                    value={createForm.secondary_button_url}
                    onChange={(e) => handleCreateChange('secondary_button_url', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com or /category/sports"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Display Order</label>
                  <input
                    type="number"
                    value={createForm.display_order}
                    onChange={(e) => handleCreateChange('display_order', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-300">Active</label>
                  <input
                    type="checkbox"
                    checked={createForm.is_active}
                    onChange={(e) => handleCreateChange('is_active', e.target.checked)}
                    className="h-4 w-4"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { 
                    setShowCreateForm(false);
                    setCreateForm({
                      title: '',
                      description: '',
                      image_url: '',
                      primary_button_text: '',
                      primary_button_url: '',
                      secondary_button_text: '',
                      secondary_button_url: '',
                      display_order: 0,
                      is_active: true,
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-bold text-white mb-4">View Hero Section</h2>
            <div className="space-y-3 text-gray-300">
              <div><span className="text-gray-400">Title:</span> {selectedSection.title}</div>
              {selectedSection.description && (
                <div><span className="text-gray-400">Description:</span> {selectedSection.description}</div>
              )}
              {selectedSection.image_url && (
                <div>
                  <span className="text-gray-400">Image:</span>
                  <img src={selectedSection.image_url} alt={selectedSection.title} className="mt-2 rounded max-h-64 object-cover w-full" />
                </div>
              )}
              <div><span className="text-gray-400">Order:</span> {selectedSection.display_order}</div>
              <div><span className="text-gray-400">Active:</span> {selectedSection.is_active ? 'Yes' : 'No'}</div>
              {(selectedSection.primary_button_text || selectedSection.primary_button_url) && (
                <div>
                  <span className="text-gray-400">Primary Button:</span> {selectedSection.primary_button_text} {selectedSection.primary_button_url && `(${selectedSection.primary_button_url})`}
                </div>
              )}
              {(selectedSection.secondary_button_text || selectedSection.secondary_button_url) && (
                <div>
                  <span className="text-gray-400">Secondary Button:</span> {selectedSection.secondary_button_text} {selectedSection.secondary_button_url && `(${selectedSection.secondary_button_url})`}
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => { setShowViewModal(false); setSelectedSection(null); }} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {showEditForm && selectedSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-bold text-white mb-4">Edit Hero Section</h2>
            <form className="space-y-4" onSubmit={submitEdit}>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => handleEditChange('title', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => handleEditChange('description', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                <input
                  type="url"
                  value={editForm.image_url}
                  onChange={(e) => handleEditChange('image_url', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Primary Button Text</label>
                  <input
                    type="text"
                    value={editForm.primary_button_text}
                    onChange={(e) => handleEditChange('primary_button_text', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Primary Button URL</label>
                  <input
                    type="text"
                    value={editForm.primary_button_url}
                    onChange={(e) => handleEditChange('primary_button_url', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com or /category/sports"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Secondary Button Text</label>
                  <input
                    type="text"
                    value={editForm.secondary_button_text}
                    onChange={(e) => handleEditChange('secondary_button_text', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Secondary Button URL</label>
                  <input
                    type="text"
                    value={editForm.secondary_button_url}
                    onChange={(e) => handleEditChange('secondary_button_url', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com or /category/sports"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Display Order</label>
                  <input
                    type="number"
                    value={editForm.display_order}
                    onChange={(e) => handleEditChange('display_order', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-300">Active</label>
                  <input
                    type="checkbox"
                    checked={editForm.is_active}
                    onChange={(e) => handleEditChange('is_active', e.target.checked)}
                    className="h-4 w-4"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowEditForm(false); setSelectedSection(null); }}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
