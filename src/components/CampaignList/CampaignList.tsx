'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Loader, RefreshCw } from 'lucide-react';
import { Campaign } from '../../types/campaign';
import { campaignApi } from '../../services/campaignApi';
import CampaignCard from '../CampaignCard/CampaignCard';

interface CampaignListProps {
  onEdit: (campaign: Campaign) => void;
  refreshTrigger?: number;
}

export default function CampaignList({ onEdit, refreshTrigger }: CampaignListProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await campaignApi.getAll();
      setCampaigns(data);
    } catch (err) {
      setError('Erro ao carregar campanhas. Verifique se a API está rodando.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [refreshTrigger]);

  const handleDelete = async (documentId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta campanha?')) {
      try {
        await campaignApi.delete(documentId);
        setCampaigns(prev => prev.filter(campaign => campaign.documentId !== documentId));
      } catch (err) {
        alert('Erro ao excluir campanha');
      }
    }
  };

  const handleRefresh = () => {
    fetchCampaigns();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <Loader className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-slate-600">Carregando campanhas...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <span className="text-slate-600">{error}</span>
        </div>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Nenhuma campanha encontrada
          </h3>
          <p className="text-slate-600 mb-4">
            Comece criando sua primeira campanha
          </p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900">
          {campaigns.length} {campaigns.length === 1 ? 'Campanha' : 'Campanhas'}
        </h2>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center px-3 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </button>
      </div>

      {/* Campaign Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            onEdit={onEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
} 