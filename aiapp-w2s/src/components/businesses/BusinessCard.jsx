import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Pencil, Trash2, Star, MapPin, FileText, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BusinessCard({ business, index, onEdit, onDelete, onSetPrimary }) {
  const structureLabels = {
    sole_proprietorship: 'Sole Proprietorship',
    partnership: 'Partnership',
    llc: 'LLC',
    corporation: 'Corporation',
    non_profit: 'Non-Profit',
    other: 'Other'
  };

  const taxElectionLabels = {
    default: 'Default',
    s_corp: 'S Corp',
    c_corp: 'C Corp'
  };

  const structureColors = {
    sole_proprietorship: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    partnership: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    llc: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    corporation: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    non_profit: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-14 h-14 rounded-xl bg-[#9ab292] dark:bg-white flex items-center justify-center flex-shrink-0 shadow-lg">
              <Building2 className="w-7 h-7 text-white dark:text-[#510069]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {business.business_name}
                </h3>
                {business.is_primary && (
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                )}
              </div>
              {business.industry && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {business.industry}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <Badge className={structureColors[business.business_structure]}>
                  {structureLabels[business.business_structure]}
                </Badge>
                {business.tax_election && business.tax_election !== 'default' && (
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                    {taxElectionLabels[business.tax_election]}
                  </Badge>
                )}
                {business.location && (
                  <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                    <MapPin className="w-3 h-3 mr-1" />
                    {business.location}
                  </Badge>
                )}
                {business.ownership_status && (
                  <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                    <Users className="w-3 h-3 mr-1" />
                    {business.ownership_status}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {!business.is_primary && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSetPrimary(business.id)}
                className="text-gray-400 hover:text-yellow-500 dark:text-gray-500 dark:hover:text-yellow-400"
                title="Set as primary business"
              >
                <Star className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(business)}
              className="text-gray-400 hover:text-[#510069] dark:text-gray-500 dark:hover:text-white"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(business.id)}
              className="text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {business.description && (
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
            {business.description}
          </p>
        )}

        <div className="space-y-3">
          {business.ein && (
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <FileText className="w-4 h-4 text-[#9ab292] dark:text-white flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  EIN
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-200 font-mono">
                  {business.ein}
                </p>
              </div>
            </div>
          )}

          {(business.owner_age || business.owner_gender || business.owner_ethnicity) && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">
                Owner Demographics
              </p>
              <div className="space-y-1 text-sm text-blue-600 dark:text-blue-200">
                {business.owner_age && <p>Age: {business.owner_age}</p>}
                {business.owner_gender && business.owner_gender !== 'prefer_not_to_say' && (
                  <p>Gender: {business.owner_gender.charAt(0).toUpperCase() + business.owner_gender.slice(1).replace('_', ' ')}</p>
                )}
                {business.owner_ethnicity && <p>Ethnicity: {business.owner_ethnicity}</p>}
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}