
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Copy, CheckCircle, User as UserIcon, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getReferralLink = () => {
    if (!user) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}${createPageUrl('Welcome')}?ref=${user.id}`;
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(getReferralLink());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#c6c6c6]/20 to-white dark:from-[#510069] dark:to-[#3a004d] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#510069] dark:bg-white flex items-center justify-center animate-pulse">
            <UserIcon className="w-8 h-8 text-white dark:text-[#510069]" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#c6c6c6]/20 to-white dark:from-[#510069] dark:to-[#3a004d] p-4">
      <div className="max-w-2xl mx-auto py-6">
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl('Chat')}>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#c6c6c6]/30 dark:hover:bg-white/20">
              <ArrowLeft className="w-5 h-5 dark:text-white" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
            <p className="text-gray-500 dark:text-gray-300 mt-1">Manage your account and referrals</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* User Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-[#510069] dark:bg-white flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-8 h-8 text-white dark:text-[#510069]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {user?.full_name}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-3">{user?.email}</p>
                  {user?.role === 'admin' ? (
                    <div className="inline-block px-3 py-1 rounded-full bg-yellow-500/20 dark:bg-yellow-500/30 text-yellow-700 dark:text-yellow-300 text-sm font-medium">
                      ADMIN
                    </div>
                  ) : user?.role === 'internal' ? (
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 dark:bg-blue-500/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
                      INTERNAL
                    </div>
                  ) : user?.business_type ? (
                    <div className="inline-block px-3 py-1 rounded-full bg-[#9ab292]/20 dark:bg-white/20 text-[#9ab292] dark:text-white text-sm font-medium">
                      {user.business_type === 'has_business' ? 'Has Business' : 'Starting Business'}
                    </div>
                  ) : null}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Referral Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#510069]/10 dark:bg-white/20 flex items-center justify-center">
                  <LinkIcon className="w-6 h-6 text-[#510069] dark:text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Refer Friends</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Share your unique referral link</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Invite your friends to join! When they sign up using your link, they'll be automatically connected to your referral.
                </p>
                <div className="flex gap-2">
                  <Input
                    value={getReferralLink()}
                    readOnly
                    className="flex-1 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  />
                  <Button
                    onClick={copyReferralLink}
                    className="bg-[#510069] hover:bg-[#510069]/90 dark:bg-white dark:text-[#510069] dark:hover:bg-gray-200"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 <strong>Tip:</strong> Share this link on social media, email, or with friends who might benefit from our AI assistant!
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
