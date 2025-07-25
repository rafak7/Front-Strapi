'use client';

import React, { useState } from 'react';
import { X, Save, Loader, Building } from 'lucide-react';
import { CompanyFormData } from '../../types/company';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CompanyFormData) => Promise<void>;
  loading?: boolean;
}

export default function CompanyModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading = false 
}: CompanyModalProps) {
  const [formData, setFormData] = useState<CompanyFormData>({
    nome_empresa: '',
    setor_empresa: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        nome_empresa: '',
        setor_empresa: '',
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome_empresa.trim()) {
      newErrors.nome_empresa = 'Nome da empresa é obrigatório';
    }

    if (!formData.setor_empresa.trim()) {
      newErrors.setor_empresa = 'Setor da empresa é obrigatório';
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
      await onSubmit(formData);
      // Reset form after successful submission
      setFormData({
        nome_empresa: '',
        setor_empresa: '',
      });
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-2 sm:mx-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">
                Nova Empresa
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              disabled={isSubmitting || loading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
            {/* Nome da Empresa */}
            <div>
              <label htmlFor="nome_empresa" className="block text-sm font-medium text-slate-700 mb-1">
                Nome da Empresa *
              </label>
              <input
                type="text"
                id="nome_empresa"
                name="nome_empresa"
                value={formData.nome_empresa}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 text-base ${
                  errors.nome_empresa ? 'border-red-300' : 'border-slate-300'
                }`}
                placeholder="Digite o nome da empresa"
                disabled={isSubmitting || loading}
              />
              {errors.nome_empresa && (
                <p className="mt-1 text-sm text-red-600">{errors.nome_empresa}</p>
              )}
            </div>

            {/* Setor da Empresa */}
            <div>
              <label htmlFor="setor_empresa" className="block text-sm font-medium text-slate-700 mb-1">
                Setor da Empresa *
              </label>
              <select
                id="setor_empresa"
                name="setor_empresa"
                value={formData.setor_empresa}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 text-base ${
                  errors.setor_empresa ? 'border-red-300' : 'border-slate-300'
                }`}
                disabled={isSubmitting || loading}
              >
                <option value="">Selecione o setor</option>
                <option value="Tecnologia">Tecnologia</option>
                <option value="Saúde">Saúde</option>
                <option value="Educação">Educação</option>
                <option value="Varejo">Varejo</option>
                <option value="Serviços">Serviços</option>
                <option value="Indústria">Indústria</option>
                <option value="Agricultura">Agricultura</option>
                <option value="Construção">Construção</option>
                <option value="Finanças">Finanças</option>
                <option value="Turismo">Turismo</option>
                <option value="Outro">Outro</option>
              </select>
              {errors.setor_empresa && (
                <p className="mt-1 text-sm text-red-600">{errors.setor_empresa}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors order-2 sm:order-1"
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
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Criar Empresa
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