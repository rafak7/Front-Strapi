'use client';

import React, { useState, useEffect } from 'react';
import { Save, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Campaign, CampaignFormData } from '../../../types/campaign';
import { useCampaigns } from '../../../hooks/useCampaigns';

interface CriarCampanhaSectionProps {
  editingCampaign?: Campaign | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function CriarCampanhaSection({ 
  editingCampaign, 
  onCancel, 
  onSuccess 
}: CriarCampanhaSectionProps) {
  const { loading, createCampaign, updateCampaignById } = useCampaigns();

  const [formData, setFormData] = useState<CampaignFormData>({
    nome_campanha: '',
    descricao_campanha: '',
    status_campanha: 'ativa',
    data_campanha: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Preencher formulário se estiver editando
  useEffect(() => {
    if (editingCampaign) {
      setFormData({
        id_campanha: editingCampaign.id_campanha,
        nome_campanha: editingCampaign.nome_campanha,
        descricao_campanha: editingCampaign.descricao_campanha,
        status_campanha: editingCampaign.status_campanha,
        data_campanha: editingCampaign.data_campanha,
      });
    } else {
      // Limpar formulário para nova campanha
      setFormData({
        nome_campanha: '',
        descricao_campanha: '',
        status_campanha: 'ativa',
        data_campanha: '',
      });
    }
    setErrors({});
    setShowSuccess(false);
  }, [editingCampaign]);

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
      
      if (editingCampaign && editingCampaign.documentId) {
        await updateCampaignById(editingCampaign.documentId, formData);
      } else {
        await createCampaign(formData);
      }
      
      setShowSuccess(true);
      
      // Auto-redirect após sucesso
      setTimeout(() => {
        onSuccess();
      }, 2000);
      
    } catch (error) {
      // Error já está sendo tratado pelo hook/store
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
    
    // Limpar erro quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCancel = () => {
    if (window.confirm('Tem certeza que deseja cancelar? Todas as alterações serão perdidas.')) {
      setFormData({
        nome_campanha: '',
        descricao_campanha: '',
        status_campanha: 'ativa',
        data_campanha: '',
      });
      setErrors({});
      
      // Se está editando, apenas limpar formulário
      // Se está criando, navegar de volta
      if (!editingCampaign && typeof window !== 'undefined') {
        window.history.back();
      }
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-0">
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 sm:p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-green-900 mb-2">
              {editingCampaign ? 'Campanha Atualizada!' : 'Campanha Criada!'}
            </h2>
            <p className="text-green-700 mb-2">
              A campanha "{formData.nome_campanha}" foi {editingCampaign ? 'atualizada' : 'criada'} com sucesso.
            </p>
            <p className="text-sm text-green-600">
              Redirecionando para a lista de campanhas...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0">
      <div className="bg-white rounded-lg border shadow-sm">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {editingCampaign ? 'Editar Campanha' : 'Criar Nova Campanha'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {editingCampaign 
                  ? 'Modifique os dados da campanha existente'
                  : 'Preencha os dados para criar uma nova campanha'
                }
              </p>
            </div>
            {editingCampaign && (
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          {/* Nome da Campanha */}
          <div>
            <label htmlFor="nome_campanha" className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Campanha *
            </label>
            <input
              type="text"
              id="nome_campanha"
              name="nome_campanha"
              value={formData.nome_campanha}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base ${
                errors.nome_campanha ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Digite o nome da campanha"
              disabled={isSubmitting || loading}
            />
            {errors.nome_campanha && (
              <div className="mt-1 flex items-center text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                {errors.nome_campanha}
              </div>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="descricao_campanha" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição *
            </label>
            <textarea
              id="descricao_campanha"
              name="descricao_campanha"
              value={formData.descricao_campanha}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base resize-none ${
                errors.descricao_campanha ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Descreva a campanha em detalhes"
              disabled={isSubmitting || loading}
            />
            {errors.descricao_campanha && (
              <div className="mt-1 flex items-center text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                {errors.descricao_campanha}
              </div>
            )}
          </div>

          {/* Status e Data em uma linha para desktop, empilhados no mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Status */}
            <div>
              <label htmlFor="status_campanha" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status_campanha"
                name="status_campanha"
                value={formData.status_campanha}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
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
              <label htmlFor="data_campanha" className="block text-sm font-medium text-gray-700 mb-2">
                Data da Campanha *
              </label>
              <input
                type="date"
                id="data_campanha"
                name="data_campanha"
                value={formData.data_campanha}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base ${
                  errors.data_campanha ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isSubmitting || loading}
              />
              {errors.data_campanha && (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                  {errors.data_campanha}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors order-2 sm:order-1"
              disabled={isSubmitting || loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
            >
              {(isSubmitting || loading) ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editingCampaign ? 'Atualizar' : 'Criar'} Campanha
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 