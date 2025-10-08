import React, { useState, useEffect } from 'react';
import { getCurrentUser, updateUser } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Building2, Rocket, ArrowRight, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Welcome() {
  const navigate = useNavigate();
  const [isSelecting, setIsSelecting] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(true);
  const [referralId, setReferralId] = useState(null);

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
  }, []); // Empty dependency array means it runs once on mount

  useEffect(() => {
    // Check for referral code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
      setReferralId(ref);
    }
    
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const user = await getCurrentUser();
      
      // Admins and internal users skip the welcome page
      if (user.role === 'admin' || user.role === 'internal') {
        await updateUser({ onboarding_completed: true });
        navigate(createPageUrl('Chat'));
        return;
      }
    } catch (error) {
      console.error('Error checking user role:', error);
    } finally {
      setIsCheckingRole(false);
    }
  };

  const handleSelection = async (businessType) => {
    setIsSelecting(true);
    try {
      const updateData = {
        business_type: businessType,
        onboarding_completed: true
      };
      
      // If there's a referral ID, save it
      if (referralId) {
        updateData.referred_by = referralId;
      }
      
      await updateUser(updateData);

      // Navigate to the appropriate chat page based on businessType
      let targetPage = 'Chat'; // Default to 'Chat' (Where 2 Start?)
      if (businessType === 'wants_to_start') {
        targetPage = 'BusinessBasics'; // Redirect to Business Basics for 'I Want to Start a Business'
      } else if (businessType === 'unknown_start') {
        targetPage = 'AskAQuestion'; // Redirect to Ask a Question for 'I don't know Where 2 Start'
      }
      navigate(createPageUrl(targetPage));

    } catch (error) {
      console.error('Error saving selection:', error);
      setIsSelecting(false);
    }
  };

  if (isCheckingRole) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#c6c6c6]/20 to-white dark:from-gray-900 dark:to-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#510069] flex items-center justify-center animate-pulse">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#c6c6c6]/20 to-white dark:from-gray-900 dark:to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#510069] flex items-center justify-center shadow-2xl"
          >
            <img src="/w2s-logo1.png" alt="Logo" className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Where 2 Start?
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Choose the option that best describes you
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6"> {/* Changed to md:grid-cols-3 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card 
              className="p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#510069] group bg-white dark:bg-gray-800"
              onClick={() => !isSelecting && handleSelection('has_business')}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#9ab292]/20 flex items-center justify-center group-hover:bg-[#9ab292]/30 transition-colors">
                  <Building2 className="w-8 h-8 text-[#9ab292]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  I Have a Business
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Get help managing and growing your existing business
                </p>
                <Button 
                  className="w-full bg-[#510069] hover:bg-[#510069]/90"
                  disabled={isSelecting}
                >
                  Select <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card 
              className="p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#510069] group bg-white dark:bg-gray-800"
              onClick={() => !isSelecting && handleSelection('wants_to_start')}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#510069]/20 flex items-center justify-center group-hover:bg-[#510069]/30 transition-colors">
                  <Rocket className="w-8 h-8 text-[#510069]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  I Want to Start a Business
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Get guidance on launching your business from scratch
                </p>
                <Button 
                  className="w-full bg-[#510069] hover:bg-[#510069]/90"
                  disabled={isSelecting}
                >
                  Select <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* New "I don't know Where 2 Start" card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }} // Adjusted delay
          >
            <Card 
              className="p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#510069] group bg-white dark:bg-gray-800"
              onClick={() => !isSelecting && handleSelection('unknown_start')} // New business_type
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#ff7315]/20 flex items-center justify-center group-hover:bg-[#ff7315]/30 transition-colors">
                  <HelpCircle className="w-8 h-8 text-[#ff7315]" /> {/* Using HelpCircle icon */}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  I Don't Know Where 2 Start
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Just want to learn and not sure where to start?
                </p>
                <Button 
                  className="w-full bg-[#510069] hover:bg-[#510069]/90"
                  disabled={isSelecting}
                >
                  Select <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}