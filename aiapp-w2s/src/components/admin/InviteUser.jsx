import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserPlus, CheckCircle } from 'lucide-react';

export default function InviteUser() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInvite = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Note: The actual invite functionality needs to be done through the base44 dashboard
      // This is a placeholder UI that guides users to the dashboard
      setMessage({ 
        type: 'info', 
        text: 'To invite users, please go to Dashboard → Users → Invite User in the base44 dashboard. After they sign up, you can manage their role here.' 
      });
      setEmail('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send invitation. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <Card className="p-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#510069] dark:bg-white flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-white dark:text-[#510069]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Invite New User</h2>
            <p className="text-gray-500 dark:text-gray-400">Send an invitation to join the platform</p>
          </div>
        </div>

        <form onSubmit={handleInvite} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-gray-900 dark:text-white">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              The user will receive an invitation email and can sign up using their email.
            </p>
          </div>

          {message && (
            <Alert className={message.type === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : message.type === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'}>
              <AlertDescription className={message.type === 'error' ? 'text-red-800 dark:text-red-200' : message.type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-blue-800 dark:text-blue-200'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">How to invite users:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-300">
              <li>Go to Dashboard → Users</li>
              <li>Click "Invite User"</li>
              <li>Enter the user's email</li>
              <li>After they sign up, come back here to manage their role</li>
            </ol>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#510069] hover:bg-[#510069]/90 dark:bg-white dark:text-[#510069] dark:hover:bg-gray-200"
          >
            {isLoading ? 'Processing...' : 'Continue to Dashboard'}
          </Button>
        </form>
      </Card>
    </div>
  );
}