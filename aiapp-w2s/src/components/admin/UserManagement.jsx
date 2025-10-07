
import React, { useState, useEffect } from 'react';
import { getUsers, getMessages, updateUserById } from '@/api/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User as UserIcon, Crown, MessageSquare, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const allUsers = await getUsers();
      const messages = await getMessages();

      const stats = {};
      allUsers.forEach(user => {
        const userMessages = messages.filter(m => m.created_by === user.email);
        const uniqueConversations = new Set(userMessages.map(m => m.conversation_id));
        
        stats[user.email] = {
          messageCount: userMessages.length,
          conversationCount: uniqueConversations.size,
          lastActive: userMessages.length > 0 
            ? new Date(Math.max(...userMessages.map(m => new Date(m.created_date))))
            : null,
          referralCount: allUsers.filter(u => u.referred_by === user.id).length
        };
      });

      setUsers(allUsers.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await updateUserById(userId, { role: newRole });
      loadUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return (
        <Badge className="bg-yellow-500 text-white">
          <Crown className="w-3 h-3 mr-1" />
          Admin
        </Badge>
      );
    }
    if (role === 'internal') {
      return (
        <Badge className="bg-blue-500 text-white">
          <Shield className="w-3 h-3 mr-1" />
          Internal
        </Badge>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user, index) => {
        const stats = userStats[user.email] || { messageCount: 0, conversationCount: 0, lastActive: null, referralCount: 0 };
        
        return (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-[#510069] dark:bg-white flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-6 h-6 text-white dark:text-[#510069]" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {user.full_name}
                      </h3>
                      {getRoleBadge(user.role)}
                    </div>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {user.email}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                        <MessageSquare className="w-4 h-4" />
                        <span>{stats.messageCount} messages</span>
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        {stats.conversationCount} conversations
                      </div>
                      {stats.referralCount > 0 && (
                        <div className="text-gray-600 dark:text-gray-300">
                          🎁 {stats.referralCount} referrals
                        </div>
                      )}
                      {stats.lastActive && (
                        <div className="text-gray-600 dark:text-gray-300">
                          Last active: {format(stats.lastActive, 'MMM d, yyyy')}
                        </div>
                      )}
                      {user.business_type && user.role === 'user' && (
                        <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                          {user.business_type === 'has_business' ? 'Has Business' : 'Starting Business'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <Select
                    value={user.role}
                    onValueChange={(value) => updateUserRole(user.id, value)}
                  >
                    <SelectTrigger className="w-32 dark:border-gray-600 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="internal">Internal</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
      
      {users.length === 0 && (
        <Card className="p-12 text-center bg-white dark:bg-gray-800">
          <UserIcon className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No users found</h3>
          <p className="text-gray-500 dark:text-gray-400">Users will appear here once they sign up</p>
        </Card>
      )}
    </div>
  );
}
