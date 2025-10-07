import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function BusinessForm({ business, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(business || {
    business_name: '',
    business_structure: 'sole_proprietorship',
    tax_election: 'default',
    ownership_status: '',
    ein: '',
    location: '',
    owner_age: '',
    owner_gender: 'prefer_not_to_say',
    owner_ethnicity: '',
    industry: '',
    description: '',
    is_primary: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-6"
    >
      <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {business ? 'Edit Business' : 'Add New Business'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 dark:text-white" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Business Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="business_name" className="text-gray-900 dark:text-white">
                Business Name *
              </Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) => handleChange('business_name', e.target.value)}
                required
                className="mt-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="industry" className="text-gray-900 dark:text-white">
                Industry
              </Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => handleChange('industry', e.target.value)}
                placeholder="e.g., E-commerce, Consulting, Food"
                className="mt-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-900 dark:text-white">
              Business Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief description of what your business does..."
              className="mt-2 h-20 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          {/* Tax & Ownership Info */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Legal & Tax Information
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="business_structure" className="text-gray-900 dark:text-white">
                  Business Structure *
                </Label>
                <Select
                  value={formData.business_structure}
                  onValueChange={(value) => handleChange('business_structure', value)}
                >
                  <SelectTrigger className="mt-2 dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="llc">LLC</SelectItem>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="non_profit">Non-Profit</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tax_election" className="text-gray-900 dark:text-white">
                  Tax Election
                </Label>
                <Select
                  value={formData.tax_election}
                  onValueChange={(value) => handleChange('tax_election', value)}
                >
                  <SelectTrigger className="mt-2 dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default (Pass-through)</SelectItem>
                    <SelectItem value="s_corp">S Corporation</SelectItem>
                    <SelectItem value="c_corp">C Corporation</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Optional tax election for LLCs and Partnerships
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="ownership_status" className="text-gray-900 dark:text-white">
                  Ownership Status
                </Label>
                <Input
                  id="ownership_status"
                  value={formData.ownership_status}
                  onChange={(e) => handleChange('ownership_status', e.target.value)}
                  placeholder="e.g., 100% owner, 50% partner"
                  className="mt-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <div>
                <Label htmlFor="ein" className="text-gray-900 dark:text-white">
                  EIN (Optional)
                </Label>
                <Input
                  id="ein"
                  value={formData.ein}
                  onChange={(e) => handleChange('ein', e.target.value)}
                  placeholder="XX-XXXXXXX"
                  className="mt-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="location" className="text-gray-900 dark:text-white">
                Location *
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="City, State, Country"
                required
                className="mt-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
          </div>

          {/* Owner Demographics */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Owner Demographics (Optional)
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="owner_age" className="text-gray-900 dark:text-white">
                  Age
                </Label>
                <Input
                  id="owner_age"
                  value={formData.owner_age}
                  onChange={(e) => handleChange('owner_age', e.target.value)}
                  placeholder="e.g., 35 or 30-40"
                  className="mt-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <div>
                <Label htmlFor="owner_gender" className="text-gray-900 dark:text-white">
                  Gender
                </Label>
                <Select
                  value={formData.owner_gender}
                  onValueChange={(value) => handleChange('owner_gender', value)}
                >
                  <SelectTrigger className="mt-2 dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non_binary">Non-Binary</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer Not to Say</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="owner_ethnicity" className="text-gray-900 dark:text-white">
                  Ethnicity
                </Label>
                <Input
                  id="owner_ethnicity"
                  value={formData.owner_ethnicity}
                  onChange={(e) => handleChange('owner_ethnicity', e.target.value)}
                  placeholder="Optional"
                  className="mt-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <input
              type="checkbox"
              id="is_primary"
              checked={formData.is_primary}
              onChange={(e) => handleChange('is_primary', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#510069] focus:ring-[#510069]"
            />
            <Label htmlFor="is_primary" className="text-gray-900 dark:text-white cursor-pointer">
              Set as primary business (AI will prioritize this business context)
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#510069] hover:bg-[#510069]/90 dark:bg-white dark:text-[#510069] dark:hover:bg-gray-200"
            >
              {business ? 'Update Business' : 'Add Business'}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}