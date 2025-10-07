
import React, { useState, useEffect } from 'react';
import { getBusinesses, createBusiness, updateBusiness, deleteBusiness } from '@/api/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Plus, Pencil, Trash2, ArrowLeft, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';

import BusinessForm from '../components/businesses/BusinessForm';
import BusinessCard from '../components/businesses/BusinessCard';

export default function Businesses() {
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);

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
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    setIsLoading(true);
    try {
      const allBusinesses = await getBusinesses();
      setBusinesses(allBusinesses.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
    } catch (error) {
      console.error('Error loading businesses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (businessData) => {
    try {
      if (editingBusiness) {
        await updateBusiness(editingBusiness.id, businessData);
      } else {
        // If this is marked as primary, unmark all others
        if (businessData.is_primary) {
          const primaryBusinesses = businesses.filter(b => b.is_primary);
          for (const b of primaryBusinesses) {
            await updateBusiness(b.id, { is_primary: false });
          }
        }
        await createBusiness(businessData);
      }
      setShowForm(false);
      setEditingBusiness(null);
      loadBusinesses();
    } catch (error) {
      console.error('Error saving business:', error);
    }
  };

  const handleEdit = (business) => {
    setEditingBusiness(business);
    setShowForm(true);
  };

  const handleDelete = async (businessId) => {
    if (window.confirm('Are you sure you want to delete this business?')) {
      try {
        await deleteBusiness(businessId);
        loadBusinesses();
      } catch (error) {
        console.error('Error deleting business:', error);
      }
    }
  };

  const handleSetPrimary = async (businessId) => {
    try {
      // Unmark all as primary
      const primaryBusinesses = businesses.filter(b => b.is_primary);
      for (const b of primaryBusinesses) {
        await updateBusiness(b.id, { is_primary: false });
      }
      // Mark selected as primary
      await updateBusiness(businessId, { is_primary: true });
      loadBusinesses();
    } catch (error) {
      console.error('Error setting primary business:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#c6c6c6]/20 to-white dark:from-[#510069] dark:to-[#3a004d] p-4">
      <div className="max-w-4xl mx-auto py-6">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to={createPageUrl('Chat')}>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#c6c6c6]/30 dark:hover:bg-white/20">
                <ArrowLeft className="w-5 h-5 dark:text-white" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Businesses</h1>
              <p className="text-gray-500 dark:text-gray-300 mt-1">
                Manage your business information to get better AI assistance
              </p>
            </div>
          </div>
          
          <Button
            onClick={() => {
              setEditingBusiness(null);
              setShowForm(true);
            }}
            className="w-full sm:w-auto bg-[#510069] hover:bg-[#510069]/90 dark:bg-white dark:text-[#510069] dark:hover:bg-gray-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Business
          </Button>
        </div>

        <AnimatePresence>
          {showForm && (
            <BusinessForm
              business={editingBusiness}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingBusiness(null);
              }}
            />
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : businesses.length === 0 ? (
          <Card className="p-12 text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#9ab292] dark:bg-white flex items-center justify-center shadow-2xl">
              <Building2 className="w-10 h-10 text-white dark:text-[#510069]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No businesses yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Add your business information to help the AI provide better advice
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-[#510069] hover:bg-[#510069]/90 dark:bg-white dark:text-[#510069] dark:hover:bg-gray-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Business
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {businesses.map((business, index) => (
              <BusinessCard
                key={business.id}
                business={business}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSetPrimary={handleSetPrimary}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
