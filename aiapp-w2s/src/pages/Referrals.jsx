
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Copy, CheckCircle, Gift, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

export default function Referrals() {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [referrals, setReferrals] = useState([]);
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
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const users = await User.list('-created_date');
      setAllUsers(users);

      // Find users referred by current user
      const myReferrals = users.filter(u => u.referred_by === currentUser.id);
      setReferrals(myReferrals);
    } catch (error) {
      console.error('Error loading data:', error);
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
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#ff7315] flex items-center justify-center animate-pulse">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#c6c6c6]/20 to-white dark:from-[#510069] dark:to-[#3a004d] p-4">
      <div className="max-w-4xl mx-auto py-6">
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl('Chat')}>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#c6c6c6]/30 dark:hover:bg-white/20">
              <ArrowLeft className="w-5 h-5 dark:text-white" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Referrals</h1>
            <p className="text-gray-500 dark:text-gray-300 mt-1">Share and track your referrals</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#ff7315]/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#ff7315]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Referrals</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{referrals.length}</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Referrals</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {referrals.filter(r => r.onboarding_completed).length}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Referral Link Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#510069]/10 dark:bg-white/20 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-[#510069] dark:text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Referral Link</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Share this link to invite friends</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
                <div className="flex gap-2">
                  <Input
                    value={getReferralLink()}
                    readOnly
                    className="flex-1 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  />
                  <Button
                    onClick={copyReferralLink}
                    className="bg-[#ff7315] hover:bg-[#ff7315]/90 text-white"
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
                  💡 <strong>How it works:</strong> Share this link with friends. When they sign up using your link, they'll be automatically connected as your referral!
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Referrals List */}
          {referrals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Referrals</h3>
                <div className="space-y-3">
                  {referrals.map((referral, index) => (
                    <motion.div
                      key={referral.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#510069] dark:bg-white flex items-center justify-center">
                          <Users className="w-5 h-5 text-white dark:text-[#510069]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{referral.full_name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{referral.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {referral.onboarding_completed ? (
                          <span className="inline-block px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium">
                            Active
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium">
                            Pending
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {referrals.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-12 text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <Gift className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No referrals yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Share your referral link above to start inviting friends!
                </p>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
