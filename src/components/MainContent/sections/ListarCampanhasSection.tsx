'use client';

import React from 'react';
import { AlertCircle, Loader, RefreshCw } from 'lucide-react';
import { Campaign, CampaignFilters } from '../../../types/campaign';
import { useCampaigns } from '../../../hooks/useCampaigns';
import CampaignCard from '../../CampaignCard/CampaignCard';
import CampaignFiltersComponent from '../../CampaignFilters/CampaignFilters';

interface ListarCampanhasSectionProps {
  onEdit: (campaign: Campaign) => void;
}

export default function ListarCampanhasSection({ onEdit }: ListarCampanhasSectionProps) {
  const { 
    campaigns, 
    loading, 
    error, 
    statusOptions, 
    currentFilters,
    deleteCampaign, 
    applyFilters,
    refreshCampaigns 
  } = useCampaigns();

  const handleDelete = async (documentId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta campanha?')) {
      try {
        await deleteCampaign(documentId);
      } catch (err) {
        alert('Erro ao excluir campanha');
      }
    }
  };

  const handleFiltersChange = async (filters: CampaignFilters) => {
    await applyFilters(filters);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center space-x-3">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-gray-600 text-lg">Carregando campanhas...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="flex items-center space-x-3 mb-6">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Erro ao carregar campanhas
            </h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
        <button
          onClick={refreshCampaigns}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Componente de Filtros */}
      <CampaignFiltersComponent
        onFiltersChange={handleFiltersChange}
        statusOptions={statusOptions}
        currentFilters={currentFilters}
      />

      {/* Header com informações */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {campaigns.length} {campaigns.length === 1 ? 'Campanha' : 'Campanhas'} encontrada{campaigns.length === 1 ? '' : 's'}
          </h3>
          <p className="text-sm text-gray-600">
            {Object.values(currentFilters).some(v => v) 
              ? 'Resultados filtrados' 
              : 'Todas as campanhas'
            }
          </p>
        </div>
        <button
          onClick={refreshCampaigns}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {/* Estado vazio */}
      {campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-center max-w-md">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {Object.values(currentFilters).some(v => v) 
                ? 'Nenhuma campanha encontrada'
                : 'Nenhuma campanha cadastrada'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {Object.values(currentFilters).some(v => v)
                ? 'Tente ajustar os filtros para encontrar campanhas ou crie uma nova campanha.'
                : 'Parece que você ainda não criou nenhuma campanha. Use o menu lateral para criar sua primeira campanha.'
              }
            </p>
            <button
              onClick={refreshCampaigns}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar Lista
            </button>
          </div>
        </div>
      ) : (
        /* Grid de Campanhas */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id || campaign.documentId}
              campaign={campaign}
              onEdit={onEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
} 