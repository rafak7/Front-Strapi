'use client';

import React from 'react';
import { Edit, Trash2, Calendar, Target, TrendingUp } from 'lucide-react';
import { Campaign } from '../../types/campaign';

interface CampaignCardProps {
  campaign: Campaign;
  onEdit: (campaign: Campaign) => void;
  onDelete: (documentId: string) => void;
}

export default function CampaignCard({ campaign, onEdit, onDelete }: CampaignCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'pausado': return 'bg-yellow-100 text-yellow-800';
      case 'concluido': return 'bg-blue-100 text-blue-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ativo': return 'Ativa';
      case 'pausado': return 'Pausada';
      case 'concluido': return 'Concluída';
      case 'cancelado': return 'Cancelada';
      default: return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-slate-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {campaign.nome_campanha}
            </h3>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status_campanha)}`}>
              {getStatusText(campaign.status_campanha)}
            </span>
          </div>
          
          <div className="flex space-x-2 ml-4">
            <button
              onClick={() => onEdit(campaign)}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(campaign.documentId)}
              className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Excluir"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {campaign.descricao_campanha}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-slate-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Data: {formatDate(campaign.data_campanha)}</span>
          </div>
        </div>

        {/* Timestamps */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            Criado: {formatDate(campaign.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
} 