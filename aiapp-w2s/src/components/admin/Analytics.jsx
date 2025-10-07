import React, { useState, useEffect } from 'react';
import { getUsers, getMessages, getSavedConversations } from '@/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, TrendingUp, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Analytics() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMessages: 0,
    totalConversations: 0,
    totalSavedChats: 0,
    activeUsers: 0,
    messagesThisWeek: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const users = await getUsers();
      const messages = await getMessages();
      const savedChats = await getSavedConversations();

      const uniqueConversations = new Set(messages.map(m => m.conversation_id)).size;
      
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const recentMessages = messages.filter(m => new Date(m.created_date) > oneWeekAgo);
      const activeUserEmails = new Set(recentMessages.map(m => m.created_by));

      setStats({
        totalUsers: users.length,
        totalMessages: messages.length,
        totalConversations: uniqueConversations,
        totalSavedChats: savedChats.length,
        activeUsers: activeUserEmails.size,
        messagesThisWeek: recentMessages.length
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      darkColor: 'dark:bg-blue-600'
    },
    {
      title: 'Total Messages',
      value: stats.totalMessages,
      icon: MessageSquare,
      color: 'bg-green-500',
      darkColor: 'dark:bg-green-600'
    },
    {
      title: 'Conversations',
      value: stats.totalConversations,
      icon: TrendingUp,
      color: 'bg-purple-500',
      darkColor: 'dark:bg-purple-600'
    },
    {
      title: 'Saved Chats',
      value: stats.totalSavedChats,
      icon: Bookmark,
      color: 'bg-orange-500',
      darkColor: 'dark:bg-orange-600'
    },
    {
      title: 'Active Users (7d)',
      value: stats.activeUsers,
      icon: Users,
      color: 'bg-indigo-500',
      darkColor: 'dark:bg-indigo-600'
    },
    {
      title: 'Messages This Week',
      value: stats.messagesThisWeek,
      icon: MessageSquare,
      color: 'bg-pink-500',
      darkColor: 'dark:bg-pink-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color} ${stat.darkColor}`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}