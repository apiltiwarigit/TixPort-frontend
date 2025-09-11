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
  isSaving?: boolean;
  category?: string;
}

interface SettingCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export default function AdminSettingsPage() {
  const { } = useAuth();
  const [settings, setSettings] = useState<ConfigSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Define setting categories
  const categories: SettingCategory[] = [
    {
      id: 'stats',
      name: 'Statistics',
      description: 'Configure public statistics and counters',
      icon: '📊',
      color: 'bg-purple-500/10 border-purple-500/20'
    },
    {
      id: 'contact',
      name: 'Contact Information',
      description: 'Business contact details and information',
      icon: '📞',
      color: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      id: 'location',
      name: 'Location Settings',
      description: 'Geographic and location-based configurations',
      icon: '📍',
      color: 'bg-green-500/10 border-green-500/20'
    },
    {
      id: 'api',
      name: 'API Configuration',
      description: 'External API and integration settings',
      icon: '🔧',
      color: 'bg-orange-500/10 border-orange-500/20'
    },
    {
      id: 'general',
      name: 'General Settings',
      description: 'General application settings',
      icon: '⚙️',
      color: 'bg-gray-500/10 border-gray-500/20'
    }
  ];

  // Function to categorize settings
  const categorizeSetting = (key: string): string => {
    if (key.startsWith('stats_')) return 'stats';
    if (key.startsWith('contact_')) return 'contact';
    if (key.startsWith('location_')) return 'location';
    if (key.startsWith('api_')) return 'api';
    return 'general';
  };

  // Group settings by category
  const groupedSettings = settings.reduce((acc, setting) => {
    const category = categorizeSetting(setting.key);
    if (!acc[category]) acc[category] = [];
    acc[category].push(setting);
    return acc;
  }, {} as Record<string, ConfigSetting[]>);

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
        const list = Array.isArray(data.data) ? data.data : [];
        // Map backend fields -> frontend model and infer type from config_type/config_value
        const mapped: ConfigSetting[] = list.map((item: { config_key: string; config_value: unknown; description?: string; config_type?: string; updated_at?: string; updatedAt?: string }) => {
          const key: string = item.config_key;
          const rawValue: unknown = item.config_value;
          const desc: string | undefined = item.description || undefined;
          const configType: string = item.config_type || typeof rawValue;
          let type: 'string' | 'number' | 'boolean' | 'json' = 'string';
          if (configType === 'number' || typeof rawValue === 'number') type = 'number';
          else if (configType === 'boolean' || typeof rawValue === 'boolean') type = 'boolean';
          else if (configType === 'json') type = 'json';
          return {
            key,
            value: type === 'json' ? JSON.stringify(rawValue ?? {}, null, 2) : String(rawValue ?? ''),
            description: desc,
            type,
            updated_at: item.updated_at || item.updatedAt || undefined,
          };
        });
        setSettings(mapped);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    // Set loading state for this specific setting
    setSettings(prev => prev.map(setting =>
      setting.key === key ? { ...setting, isSaving: true } : setting
    ));

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const token = localStorage.getItem('auth_session');

      if (!token) return;

      const session = JSON.parse(token);
      // Find the setting to parse according to its type
      const setting = settings.find(s => s.key === key);
      let parsedValue: unknown = value;
      if (setting) {
        switch (setting.type) {
          case 'number':
            parsedValue = Number(value);
            break;
          case 'boolean':
            parsedValue = String(value) === 'true';
            break;
          case 'json':
            try {
              parsedValue = value ? JSON.parse(value) : {};
            } catch (e) {
              setMessage({ type: 'error', text: 'Invalid JSON. Please fix and try again.' });
              return;
            }
            break;
          default:
            parsedValue = value;
        }
      }

      const response = await fetch(`${API_BASE}/api/admin/config`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ config_key: key, config_value: parsedValue }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Setting updated successfully!' });
        await fetchSettings();
        setTimeout(() => setMessage(null), 3000);
      } else {
        const err = await response.json().catch(() => ({}));
        setMessage({ type: 'error', text: err.message || 'Failed to update setting' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      setMessage({ type: 'error', text: 'Error updating setting' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      // Clear loading state for this specific setting
      setSettings(prev => prev.map(setting =>
        setting.key === key ? { ...setting, isSaving: false } : setting
      ));
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
            value={String(setting.value)}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      case 'json':
        return (
          <textarea
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            rows={3}
            className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            placeholder="Enter JSON..."
          />
        );
      default:
        return (
          <input
            type="text"
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">System Settings</h1>
        <p className="text-gray-400 mt-1 text-sm">Configure system-wide settings and preferences</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
          message.type === 'success'
            ? 'bg-green-900 border border-green-700 text-green-300'
            : 'bg-red-900 border border-red-700 text-red-300'
        }`}>
          {message.type === 'success' ? (
            <CheckCircleIcon className="h-4 w-4" />
          ) : (
            <ExclamationTriangleIcon className="h-4 w-4" />
          )}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      {/* Categorized Settings */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400 mt-2">Loading settings...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((category) => {
            const categorySettings = groupedSettings[category.id] || [];
            if (categorySettings.length === 0) return null;

            return (
              <div key={category.id} className={`bg-gray-800 border border-gray-700 rounded-lg p-6 ${category.color}`}>
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">{category.icon}</div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">{category.name}</h2>
                    <p className="text-sm text-gray-400">{category.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {categorySettings.map((setting) => (
                    <div key={setting.key} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-white truncate">{setting.key}</h3>
                          {setting.description && (
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{setting.description}</p>
                          )}
                        </div>
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded ml-2 flex-shrink-0">
                          {setting.type}
                        </span>
                      </div>

                      <div className="mb-3">
                        {renderSettingInput(setting)}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 truncate">
                          {setting.updated_at && `Updated: ${new Date(setting.updated_at).toLocaleString()}`}
                        </span>
                        <button
                          onClick={() => updateSetting(setting.key, setting.value)}
                          disabled={setting.isSaving}
                          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                        >
                          <SaveIcon className="h-3.5 w-3.5" />
                          {setting.isSaving ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {settings.length === 0 && (
            <div className="text-center py-8">
              <CogIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No settings found</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
