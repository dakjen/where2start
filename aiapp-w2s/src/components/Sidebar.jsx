
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Building2, Bookmark, History, Moon, Sun, Shield, User as UserIcon, Gift, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/api/client';

export default function Sidebar({ isOpen, onClose }) {
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    // Initialize dark mode on mount
    if (typeof window !== 'undefined') {
      const isDarkMode = localStorage.getItem('darkMode') === 'true';
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      setIsDark(isDarkMode);
    }
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('darkMode', 'true');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('darkMode', 'false');
      }
    }
  }, [isDark]);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
      // Optionally handle error state or redirect if user is not authenticated
    }
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-[#510069] shadow-2xl z-50"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/20 bg-[#e3d2e8] dark:bg-[#510069]">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleDarkMode}
                      className="rounded-full hover:bg-white/50 dark:hover:bg-white/20"
                    >
                      {isDark ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onClose}
                      className="rounded-full hover:bg-white/50 dark:hover:bg-white/20"
                    >
                      <X className="w-5 h-5 dark:text-white" />
                    </Button>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="flex-1 p-4 space-y-2">
                  <Link to={createPageUrl('Chat')} onClick={onClose}>
                    <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-[#e3d2e8] dark:hover:bg-white/10 transition-colors cursor-pointer group">
                      <div className="w-10 h-10 rounded-full bg-[#510069]/10 dark:bg-white/20 flex items-center justify-center group-hover:bg-[#510069]/20 dark:group-hover:bg-white/30 transition-colors">
                        <Lightbulb className="w-5 h-5 text-[#510069] dark:text-white" />
                      </div>
                      <span className="text-lg font-medium text-gray-900 dark:text-white">Where 2 Start?</span>
                    </div>
                  </Link>

                  {/* New Link: Ask a Question */}
                  <Link to={createPageUrl('AskAQuestion')} onClick={onClose}>
                    <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-[#e3d2e8] dark:hover:bg-white/10 transition-colors cursor-pointer group">
                      <div className="w-10 h-10 rounded-full bg-[#510069]/10 dark:bg-white/20 flex items-center justify-center group-hover:bg-[#510069]/20 dark:group-hover:bg-white/30 transition-colors">
                        <MessageSquare className="w-5 h-5 text-[#510069] dark:text-white" />
                      </div>
                      <span className="text-lg font-medium text-gray-900 dark:text-white">Ask a Question</span>
                    </div>
                  </Link>

                  {/* New Link: Business Basics */}
                  <Link to={createPageUrl('BusinessBasics')} onClick={onClose}>
                    <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-[#e3d2e8] dark:hover:bg-white/10 transition-colors cursor-pointer group">
                      <div className="w-10 h-10 rounded-full bg-[#9ab292]/10 dark:bg-white/20 flex items-center justify-center group-hover:bg-[#9ab292]/20 dark:group-hover:bg-white/30 transition-colors">
                        <Building2 className="w-5 h-5 text-[#9ab292] dark:text-white" />
                      </div>
                      <span className="text-lg font-medium text-gray-900 dark:text-white">Business Basics</span>
                    </div>
                  </Link>

                  <Link to={createPageUrl('Businesses')} onClick={onClose}>
                    <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-[#e3d2e8] dark:hover:bg-white/10 transition-colors cursor-pointer group">
                      <div className="w-10 h-10 rounded-full bg-[#9ab292]/10 dark:bg-white/20 flex items-center justify-center group-hover:bg-[#9ab292]/20 dark:group-hover:bg-white/30 transition-colors">
                        <Building2 className="w-5 h-5 text-[#9ab292] dark:text-white" />
                      </div>
                      <span className="text-lg font-medium text-gray-900 dark:text-white">Businesses</span>
                    </div>
                  </Link>

                  <Link to={createPageUrl('Profile')} onClick={onClose}>
                    <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-[#e3d2e8] dark:hover:bg-white/10 transition-colors cursor-pointer group">
                      <div className="w-10 h-10 rounded-full bg-[#9ab292]/10 dark:bg-white/20 flex items-center justify-center group-hover:bg-[#9ab292]/20 dark:group-hover:bg-white/30 transition-colors">
                        <UserIcon className="w-5 h-5 text-[#9ab292] dark:text-white" />
                      </div>
                      <span className="text-lg font-medium text-gray-900 dark:text-white">Profile</span>
                    </div>
                  </Link>

                  <Link to={createPageUrl('Referrals')} onClick={onClose}>
                    <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-[#e3d2e8] dark:hover:bg-white/10 transition-colors cursor-pointer group">
                      <div className="w-10 h-10 rounded-full bg-[#ff7315]/10 dark:bg-white/20 flex items-center justify-center group-hover:bg-[#ff7315]/20 dark:group-hover:bg-white/30 transition-colors">
                        <Gift className="w-5 h-5 text-[#ff7315] dark:text-white" />
                      </div>
                      <span className="text-lg font-medium text-gray-900 dark:text-white">Referrals</span>
                    </div>
                  </Link>

                  {(user?.role === 'admin' || user?.role === 'internal') && (
                    <Link to={createPageUrl('Admin')} onClick={onClose}>
                      <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-[#e3d2e8] dark:hover:bg-white/10 transition-colors cursor-pointer group border-2 border-yellow-500/30">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 dark:bg-yellow-500/30 flex items-center justify-center group-hover:bg-yellow-500/30 dark:group-hover:bg-yellow-500/40 transition-colors">
                          <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <span className="text-lg font-medium text-gray-900 dark:text-white">
                          {user?.role === 'admin' ? 'Admin Dashboard' : 'Internal Dashboard'}
                        </span>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
