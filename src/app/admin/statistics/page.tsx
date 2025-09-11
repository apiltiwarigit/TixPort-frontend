'use client';

import { useState, useEffect } from 'react';

import {
  ChartBarIcon,
  HeartIcon,
  CurrencyDollarIcon,
  TicketIcon,
  PlusIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface StatisticsData {
  totalLikes: number;
  totalMoneySaved: number;
  totalTicketsSold: number;
  breakdown: {
    likes: { manual: number; real: number };
    moneySaved: { manual: number; real: number };
    ticketsSold: { manual: number; real: number };
  };
}

export default function AdminStatisticsPage() {
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form data for manual values
  const [manualValues, setManualValues] = useState({
    likes: 0,
    moneySaved: 0,
    ticketsSold: 0
  });

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const token = localStorage.getItem('auth_session');
      
      if (!token) return;

      const session = JSON.parse(token);
      const response = await fetch(`${API_BASE}/api/admin/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
        
        // Set manual values for editing
        if (data.data?.breakdown) {
          setManualValues({
            likes: data.data.breakdown.likes.manual,
            moneySaved: data.data.breakdown.moneySaved.manual,
            ticketsSold: data.data.breakdown.ticketsSold.manual
          });
        }
      } else {
        throw new Error('Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setMessage({ type: 'error', text: 'Failed to load statistics' });
    } finally {
      setLoading(false);
    }
  };

  const updateStatistics = async () => {
    try {
      setSaving(true);
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const token = localStorage.getItem('auth_session');
      
      if (!token) return;

      const session = JSON.parse(token);
      const response = await fetch(`${API_BASE}/api/admin/statistics`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          likes: manualValues.likes,
          moneySaved: manualValues.moneySaved,
          ticketsSold: manualValues.ticketsSold
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Statistics updated successfully!' });
        await fetchStatistics(); // Refresh data
      } else {
        throw new Error('Failed to update statistics');
      }
    } catch (error) {
      console.error('Error updating statistics:', error);
      setMessage({ type: 'error', text: 'Failed to update statistics' });
    } finally {
      setSaving(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-600 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-600 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <ChartBarIcon className="h-8 w-8 mr-3 text-purple-400" />
            Statistics Management
          </h1>
          <p className="text-gray-400 mt-1">
            Manage manual counters and view real-time statistics
          </p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center ${
          message.type === 'success' 
            ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {message.type === 'success' ? (
            <CheckIcon className="h-5 w-5 mr-2" />
          ) : (
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
          )}
          {message.text}
        </div>
      )}

      {/* Current Statistics Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Likes */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center text-pink-400 mb-2">
                <HeartIcon className="h-6 w-6 mr-2" />
                <span className="font-medium">Total Likes</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {formatNumber(stats?.totalLikes || 0)}
              </div>
              <div className="text-sm text-gray-400">
                Manual: {formatNumber(stats?.breakdown?.likes?.manual || 0)} | 
                Real: {formatNumber(stats?.breakdown?.likes?.real || 0)}
              </div>
            </div>
            <div className="p-3 bg-pink-500/10 rounded-lg">
              <HeartIcon className="h-8 w-8 text-pink-400" />
            </div>
          </div>
        </Card>

        {/* Money Saved */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center text-green-400 mb-2">
                <CurrencyDollarIcon className="h-6 w-6 mr-2" />
                <span className="font-medium">Money Saved</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                ${formatNumber(stats?.totalMoneySaved || 0)}
              </div>
              <div className="text-sm text-gray-400">
                Manual: ${formatNumber(stats?.breakdown?.moneySaved?.manual || 0)} | 
                Real: ${formatNumber(stats?.breakdown?.moneySaved?.real || 0)}
              </div>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <CurrencyDollarIcon className="h-8 w-8 text-green-400" />
            </div>
          </div>
        </Card>

        {/* Tickets Sold */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center text-blue-400 mb-2">
                <TicketIcon className="h-6 w-6 mr-2" />
                <span className="font-medium">Tickets Sold</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {formatNumber(stats?.totalTicketsSold || 0)}
              </div>
              <div className="text-sm text-gray-400">
                Manual: {formatNumber(stats?.breakdown?.ticketsSold?.manual || 0)} | 
                Real: {formatNumber(stats?.breakdown?.ticketsSold?.real || 0)}
              </div>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <TicketIcon className="h-8 w-8 text-blue-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Manual Values Editor */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <PlusIcon className="h-6 w-6 mr-2 text-purple-400" />
          Update Manual Values
        </h2>
        <p className="text-gray-400 mb-6">
          Set manual counter values that will be added to real-time statistics from actual transactions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Manual Likes */}
          <div>
            <Input
              label="Manual Likes"
              type="number"
              value={manualValues.likes}
              onChange={(e) => setManualValues(prev => ({
                ...prev,
                likes: parseInt(e.target.value) || 0
              }))}
              placeholder="0"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Total likes/reviews (real-time tracking not implemented yet)
            </p>
          </div>

          {/* Manual Money Saved */}
          <div>
            <Input
              label="Manual Money Saved ($)"
              type="number"
              value={manualValues.moneySaved}
              onChange={(e) => setManualValues(prev => ({
                ...prev,
                moneySaved: parseInt(e.target.value) || 0
              }))}
              placeholder="0"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Manual savings amount (real savings auto-calculated from orders)
            </p>
          </div>

          {/* Manual Tickets Sold */}
          <div>
            <Input
              label="Manual Tickets Sold"
              type="number"
              value={manualValues.ticketsSold}
              onChange={(e) => setManualValues(prev => ({
                ...prev,
                ticketsSold: parseInt(e.target.value) || 0
              }))}
              placeholder="0"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Manual ticket count (real tickets auto-counted from successful orders)
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            onClick={updateStatistics}
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              <>
                <CheckIcon className="h-4 w-4 mr-2" />
                Update Statistics
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Information */}
      <Card className="p-6 bg-blue-900/20 border-blue-700/30">
        <h3 className="text-lg font-semibold text-blue-300 mb-3">How Statistics Work</h3>
        <div className="space-y-2 text-sm text-blue-200">
          <p><strong>Manual Values:</strong> Set baseline numbers that you can control directly.</p>
          <p><strong>Real Values:</strong> Automatically updated when customers complete purchases.</p>
          <p><strong>Total Display:</strong> Shows manual + real values combined for each metric.</p>
          <p><strong>Money Saved:</strong> Real savings estimated at 10% of order value (configurable).</p>
          <p><strong>Tickets Sold:</strong> Real count incremented with each successful ticket purchase.</p>
        </div>
      </Card>
    </div>
  );
}
