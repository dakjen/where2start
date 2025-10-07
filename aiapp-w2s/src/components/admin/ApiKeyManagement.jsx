import React, { useState, useEffect } from 'react';
import { getApiKeys, createApiKey, updateApiKey, deleteApiKey } from '@/api/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Key, Copy, CheckCircle, Trash2, Plus, Activity, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function ApiKeyManagement() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rate_limit: 1000
  });
  const [copiedKey, setCopiedKey] = useState(null);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState(null);

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    setIsLoading(true);
    try {
      const keys = await getApiKeys();
      setApiKeys(keys.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
    } catch (error) {
      console.error('Error loading API keys:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'w2s_'; // where 2 start prefix
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  const handleCreateKey = async (e) => {
    e.preventDefault();
    try {
      const newKey = generateRandomKey();
      const created = await createApiKey({
        key: newKey,
        name: formData.name,
        description: formData.description,
        rate_limit: formData.rate_limit
      });
      
      setNewlyCreatedKey(created);
      setFormData({ name: '', description: '', rate_limit: 1000 });
      setShowForm(false);
      loadApiKeys();
    } catch (error) {
      console.error('Error creating API key:', error);
    }
  };

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleToggleActive = async (apiKey) => {
    try {
      await updateApiKey(apiKey.id, { is_active: !apiKey.is_active });
      loadApiKeys();
    } catch (error) {
      console.error('Error toggling API key:', error);
    }
  };

  const handleDeleteKey = async (apiKeyId) => {
    if (window.confirm('Are you sure you want to delete this API key? This cannot be undone.')) {
      try {
        await deleteApiKey(apiKeyId);
        loadApiKeys();
      } catch (error) {
        console.error('Error deleting API key:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">API Keys</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage API keys for external integrations
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#510069] hover:bg-[#510069]/90 dark:bg-white dark:text-[#510069] dark:hover:bg-gray-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create API Key
        </Button>
      </div>

      {/* Info Card */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Key className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
              About API Keys
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
              API keys allow external services to interact with your AI chat system. Keep your keys secure and never share them publicly.
            </p>
            <div className="bg-blue-100 dark:bg-blue-900/40 rounded p-3 text-sm text-blue-900 dark:text-blue-200">
              <strong>Note:</strong> Backend functions must be enabled for API keys to work. After creating a key, you'll need to set up the backend endpoints.
            </div>
          </div>
        </div>
      </Card>

      {/* Create Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Create New API Key
            </h3>
            <form onSubmit={handleCreateKey} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-900 dark:text-white">
                  Key Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Production API, Mobile App"
                  required
                  className="mt-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-900 dark:text-white">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="What is this API key used for?"
                  className="mt-2 h-20 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <div>
                <Label htmlFor="rate_limit" className="text-gray-900 dark:text-white">
                  Rate Limit (calls per day)
                </Label>
                <Input
                  id="rate_limit"
                  type="number"
                  value={formData.rate_limit}
                  onChange={(e) => setFormData({...formData, rate_limit: parseInt(e.target.value)})}
                  min="1"
                  className="mt-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#510069] hover:bg-[#510069]/90 dark:bg-white dark:text-[#510069] dark:hover:bg-gray-200"
                >
                  Create Key
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      {/* Newly Created Key Alert */}
      {newlyCreatedKey && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 dark:text-green-200 mb-2">
                  API Key Created Successfully!
                </h3>
                <p className="text-sm text-green-800 dark:text-green-300 mb-3">
                  Make sure to copy your API key now. You won't be able to see it again!
                </p>
                <div className="flex gap-2">
                  <Input
                    value={newlyCreatedKey.key}
                    readOnly
                    className="flex-1 font-mono text-sm bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  />
                  <Button
                    onClick={() => handleCopyKey(newlyCreatedKey.key)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {copiedKey === newlyCreatedKey.key ? (
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
                <Button
                  onClick={() => setNewlyCreatedKey(null)}
                  variant="ghost"
                  className="mt-3 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40"
                >
                  I've saved my key
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* API Keys List */}
      {apiKeys.length === 0 ? (
        <Card className="p-12 text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <Key className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No API Keys Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Create your first API key to start integrating with external services
          </p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-[#510069] hover:bg-[#510069]/90 dark:bg-white dark:text-[#510069] dark:hover:bg-gray-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create API Key
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {apiKeys.map((apiKey, index) => (
            <motion.div
              key={apiKey.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#510069]/10 dark:bg-white/20 flex items-center justify-center flex-shrink-0">
                        <Key className="w-5 h-5 text-[#510069] dark:text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {apiKey.name}
                          </h3>
                          {apiKey.is_active ? (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                              Revoked
                            </Badge>
                          )}
                        </div>
                        {apiKey.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {apiKey.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <Activity className="w-3 h-3" />
                          Usage
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {apiKey.usage_count || 0} calls
                        </p>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Rate Limit
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {apiKey.rate_limit}/day
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <Clock className="w-3 h-3" />
                          Last Used
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {apiKey.last_used ? format(new Date(apiKey.last_used), 'MMM d') : 'Never'}
                        </p>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Created
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {format(new Date(apiKey.created_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2 items-center">
                      <Input
                        value={`${apiKey.key.substring(0, 20)}...`}
                        readOnly
                        className="flex-1 font-mono text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                      <Button
                        onClick={() => handleCopyKey(apiKey.key)}
                        size="sm"
                        variant="outline"
                        className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                      >
                        {copiedKey === apiKey.key ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleToggleActive(apiKey)}
                      size="sm"
                      variant={apiKey.is_active ? "outline" : "default"}
                      className={apiKey.is_active 
                        ? "dark:border-gray-600 dark:text-white dark:hover:bg-gray-700" 
                        : "bg-green-600 hover:bg-green-700 text-white"
                      }
                    >
                      {apiKey.is_active ? 'Revoke' : 'Activate'}
                    </Button>
                    <Button
                      onClick={() => handleDeleteKey(apiKey.id)}
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}