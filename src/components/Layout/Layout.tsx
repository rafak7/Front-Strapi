'use client';

import React, { useState } from 'react';
import { Plus, Menu } from 'lucide-react';
import { Campaign, CampaignFormData } from '../../types/campaign';
import { campaignApi } from '../../services/campaignApi';
import CampaignList from '../CampaignList/CampaignList';
import CampaignForm from '../CampaignForm/CampaignForm';

export default function Layout() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOpenForm = () => {
    setEditingCampaign(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCampaign(null);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (data: CampaignFormData) => {
    try {
      setLoading(true);
      
      if (editingCampaign) {
        // Update existing campaign
        await campaignApi.update(editingCampaign.documentId, data);
      } else {
        // Create new campaign
        await campaignApi.create(data);
      }
      
      handleCloseForm();
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Menu className="h-5 w-5 text-slate-400 mr-3" />
              <h1 className="text-2xl font-bold text-slate-900">
                Gerenciador de Campanhas
              </h1>
            </div>
            <button
              onClick={handleOpenForm}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Campanha
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Dashboard de Campanhas
          </h2>
          <p className="text-slate-600">
            Gerencie suas campanhas de financiamento coletivo
          </p>
        </div>

        <CampaignList 
          onEdit={handleEditCampaign}
          refreshTrigger={refreshTrigger}
        />
      </main>

      {/* Campaign Form Modal */}
      <CampaignForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        campaign={editingCampaign}
        loading={loading}
      />
    </div>
  );
} 