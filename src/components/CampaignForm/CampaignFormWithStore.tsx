'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Loader } from 'lucide-react';
import { Campaign, CampaignFormData } from '../../types/campaign';
import { useCampaigns } from '../../hooks/useCampaigns';

interface CampaignFormWithStoreProps {
  isOpen: boolean;
  onClose: () => void;
  campaign?: Campaign | null;
}

export default function CampaignFormWithStore({ 
  isOpen, 
  onClose, 
  campaign = null
}: CampaignFormWithStoreProps) {
  const { loading, createCampaign, updateCampaignById } = useCampaigns();

  const [formData, setFormData] = useState<CampaignFormData>({
    nome_campanha: '',
    descricao_campanha: '',
    status_campanha: 'ativa',
    data_campanha: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes or campaign changes
  useEffect(() => {
    if (isOpen) {
      if (campaign) {
        // Editing existing campaign
        setFormData({
          id_campanha: campaign.id_campanha,
          nome_campanha: campaign.nome_campanha,
          descricao_campanha: campaign.descricao_campanha,
          status_campanha: campaign.status_campanha,
          data_campanha: campaign.data_campanha,
        });
      } else {
        // Creating new campaign
        setFormData({
          nome_campanha: '',
          descricao_campanha: '',
          status_campanha: 'ativa',
          data_campanha: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, campaign]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome_campanha.trim()) {
      newErrors.nome_campanha = 'Nome da campanha é obrigatório';
    }

    if (!formData.descricao_campanha.trim()) {
      newErrors.descricao_campanha = 'Descrição da campanha é obrigatória';
    }

    if (!formData.data_campanha) {
      newErrors.data_campanha = 'Data da campanha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (campaign && campaign.documentId) {
        // Editando campanha existente
        await updateCampaignById(campaign.documentId, formData);
      } else {
        // Criando nova campanha
        await createCampaign(formData);
      }
      
      onClose();
    } catch (error) {
      // Error já está sendo tratado no hook/store
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              {campaign ? 'Editar Campanha' : 'Nova Campanha'}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              disabled={isSubmitting || loading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Nome da Campanha */}
            <div>
              <label htmlFor="nome_campanha" className="block text-sm font-medium text-slate-700 mb-1">
                Nome da Campanha *
              </label>
              <input
                type="text"
                id="nome_campanha"
                name="nome_campanha"
                value={formData.nome_campanha}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 ${
                  errors.nome_campanha ? 'border-red-300' : 'border-slate-300'
                }`}
                placeholder="Digite o nome da campanha"
                disabled={isSubmitting || loading}
              />
              {errors.nome_campanha && (
                <p className="mt-1 text-sm text-red-600">{errors.nome_campanha}</p>
              )}
            </div>

            {/* Descrição */}
            <div>
              <label htmlFor="descricao_campanha" className="block text-sm font-medium text-slate-700 mb-1">
                Descrição *
              </label>
              <textarea
                id="descricao_campanha"
                name="descricao_campanha"
                value={formData.descricao_campanha}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 ${
                  errors.descricao_campanha ? 'border-red-300' : 'border-slate-300'
                }`}
                placeholder="Descreva a campanha"
                disabled={isSubmitting || loading}
              />
              {errors.descricao_campanha && (
                <p className="mt-1 text-sm text-red-600">{errors.descricao_campanha}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status_campanha" className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                id="status_campanha"
                name="status_campanha"
                value={formData.status_campanha}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                disabled={isSubmitting || loading}
              >
                <option value="ativa">Ativa</option>
                <option value="inativa">Inativa</option>
                <option value="Finalizada">Finalizada</option>
                <option value="Pausada">Pausada</option>
              </select>
            </div>

            {/* Data */}
            <div>
              <label htmlFor="data_campanha" className="block text-sm font-medium text-slate-700 mb-1">
                Data da Campanha *
              </label>
              <input
                type="date"
                id="data_campanha"
                name="data_campanha"
                value={formData.data_campanha}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 ${
                  errors.data_campanha ? 'border-red-300' : 'border-slate-300'
                }`}
                disabled={isSubmitting || loading}
              />
              {errors.data_campanha && (
                <p className="mt-1 text-sm text-red-600">{errors.data_campanha}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
                disabled={isSubmitting || loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(isSubmitting || loading) ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {campaign ? 'Atualizar' : 'Criar'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 