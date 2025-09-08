'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Cog6ToothIcon as CogIcon,
  CheckIcon as SaveIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface ConfigSetting {
  key: string;
  value: string;
  description?: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  updated_at?: string;
}

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<ConfigSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const token = localStorage.getItem('auth_session');
      
      if (!token) return;

      const session = JSON.parse(token);
      const response = await fetch(`${API_BASE}/api/admin/config`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      setSaving(true);
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const token = localStorage.getItem('auth_session');
      
      if (!token) return;

      const session = JSON.parse(token);
      const response = await fetch(`${API_BASE}/api/admin/config`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Setting updated successfully!' });
        await fetchSettings();
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: 'Failed to update setting' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      setMessage({ type: 'error', text: 'Error updating setting' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key: string, newValue: string) => {
    setSettings(prev => prev.map(setting => 
      setting.key === key ? { ...setting, value: newValue } : setting
    ));
  };

  const renderSettingInput = (setting: ConfigSetting) => {
    switch (setting.type) {
      case 'boolean':
        return (
          <select
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      case 'json':
        return (
          <textarea
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="Enter JSON..."
          />
        );
      default:
        return (
          <input
            type="text"
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">System Settings</h1>
        <p className="text-gray-400 mt-2">Configure system-wide settings and preferences</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-900 border border-green-700 text-green-300'
            : 'bg-red-900 border border-red-700 text-red-300'
        }`}>
          {message.type === 'success' ? (
            <CheckCircleIcon className="h-5 w-5" />
          ) : (
            <ExclamationTriangleIcon className="h-5 w-5" />
          )}
          {message.text}
        </div>
      )}

      {/* Settings Form */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400 mt-2">Loading settings...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {settings.length > 0 ? (
            settings.map((setting) => (
              <div key={setting.key} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{setting.key}</h3>
                    {setting.description && (
                      <p className="text-sm text-gray-400 mt-1">{setting.description}</p>
                    )}
                  </div>
                  <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                    {setting.type}
                  </span>
                </div>
                
                <div className="mb-4">
                  {renderSettingInput(setting)}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {setting.updated_at && `Last updated: ${new Date(setting.updated_at).toLocaleString()}`}
                  </span>
                  <button
                    onClick={() => updateSetting(setting.key, setting.value)}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <SaveIcon className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <CogIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No settings found</p>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors">
            <h4 className="font-medium text-white">Clear Cache</h4>
            <p className="text-sm text-gray-400">Clear all cached data</p>
          </button>
          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors">
            <h4 className="font-medium text-white">Export Settings</h4>
            <p className="text-sm text-gray-400">Download settings backup</p>
          </button>
          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors">
            <h4 className="font-medium text-white">Reset to Defaults</h4>
            <p className="text-sm text-gray-400">Restore default configuration</p>
          </button>
          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors">
            <h4 className="font-medium text-white">System Health</h4>
            <p className="text-sm text-gray-400">Check system status</p>
          </button>
        </div>
      </div>
    </div>
  );
}
