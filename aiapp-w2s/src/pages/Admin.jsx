
import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '@/api/client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, Users, UserPlus, Key } from 'lucide-react';
import { Link } from 'react-router-dom';

import Analytics from '../components/admin/Analytics';
import UserManagement from '../components/admin/UserManagement';
import InviteUser from '../components/admin/InviteUser';
import ApiKeyManagement from '../components/admin/ApiKeyManagement';

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics');

  // Initialize dark mode on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('darkMode') === 'true';
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const currentUser = await getCurrentUser();
      
      if (currentUser.role !== 'admin' && currentUser.role !== 'internal') {
        navigate(createPageUrl('Chat'));
        return;
      }
      
      setUser(currentUser);
    } catch (error) {
      console.error('Error checking admin:', error);
      navigate(createPageUrl('Chat'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-[#c6c6c6]/20 to-white dark:from-[#510069] dark:to-[#3a004d]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#510069] flex items-center justify-center animate-pulse">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#c6c6c6]/20 to-white dark:from-[#510069] dark:to-[#3a004d] p-4">
      <div className="max-w-6xl mx-auto py-6">
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl('Chat')}>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#c6c6c6]/30 dark:hover:bg-white/20">
              <ArrowLeft className="w-5 h-5 dark:text-white" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {user.role === 'admin' ? 'Admin Dashboard' : 'Internal Dashboard'}
            </h1>
            <p className="text-gray-500 dark:text-gray-300 mt-1">
              {user.role === 'admin' ? 'Manage your app and users' : 'View analytics and invite users'}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          <Button
            onClick={() => setActiveTab('analytics')}
            variant={activeTab === 'analytics' ? 'default' : 'outline'}
            className={activeTab === 'analytics' ? 'bg-[#510069] hover:bg-[#510069]/90 dark:bg-white dark:text-[#510069] dark:hover:bg-gray-200' : 'dark:text-white dark:border-white/20'}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          
          {user.role === 'admin' && (
            <Button
              onClick={() => setActiveTab('users')}
              variant={activeTab === 'users' ? 'default' : 'outline'}
              className={activeTab === 'users' ? 'bg-[#510069] hover:bg-[#510069]/90 dark:bg-white dark:text-[#510069] dark:hover:bg-gray-200' : 'dark:text-white dark:border-white/20'}
            >
              <Users className="w-4 h-4 mr-2" />
              User Management
            </Button>
          )}

          <Button
            onClick={() => setActiveTab('invite')}
            variant={activeTab === 'invite' ? 'default' : 'outline'}
            className={activeTab === 'invite' ? 'bg-[#510069] hover:bg-[#510069]/90 dark:bg-white dark:text-[#510069] dark:hover:bg-gray-200' : 'dark:text-white dark:border-white/20'}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite User
          </Button>

          {user.role === 'admin' && (
            <Button
              onClick={() => setActiveTab('api')}
              variant={activeTab === 'api' ? 'default' : 'outline'}
              className={activeTab === 'api' ? 'bg-[#510069] hover:bg-[#510069]/90 dark:bg-white dark:text-[#510069] dark:hover:bg-gray-200' : 'dark:text-white dark:border-white/20'}
            >
              <Key className="w-4 h-4 mr-2" />
              API Keys
            </Button>
          )}
        </div>

        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'users' && user.role === 'admin' && <UserManagement />}
        {activeTab === 'invite' && <InviteUser />}
        {activeTab === 'api' && user.role === 'admin' && <ApiKeyManagement />}
      </div>
    </div>
  );
}
