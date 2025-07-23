'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Loader2 } from 'lucide-react';
import { CampaignFilters } from '../../types/campaign';

interface CampaignFiltersProps {
  onFiltersChange: (filters: CampaignFilters) => void;
  statusOptions: string[];
  currentFilters?: CampaignFilters;
}

export default function CampaignFiltersComponent({ 
  onFiltersChange, 
  statusOptions, 
  currentFilters = {}
}: CampaignFiltersProps) {
  const [filters, setFilters] = useState<CampaignFilters>(currentFilters);
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(currentFilters.nome_campanha || '');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Sincronizar com os filtros atuais quando mudarem
  useEffect(() => {
    setFilters(currentFilters);
    setLocalSearchTerm(currentFilters.nome_campanha || '');
    setIsSearching(false);
  }, [currentFilters]);

  // Debounce para busca por nome
  useEffect(() => {
    const currentValue = filters.nome_campanha || '';
    
    if (localSearchTerm !== currentValue) {
      setIsSearching(true);
      
      const timer = setTimeout(() => {
        setFilters(prevFilters => {
          const newFilters = { ...prevFilters };
          
          if (!localSearchTerm || localSearchTerm.trim() === '') {
            delete newFilters.nome_campanha;
          } else {
            newFilters.nome_campanha = localSearchTerm;
          }
          
          onFiltersChange(newFilters);
          return newFilters;
        });
        setIsSearching(false);
      }, 500); // 500ms de delay

      return () => {
        clearTimeout(timer);
        setIsSearching(false);
      };
    } else {
      setIsSearching(false);
    }
  }, [localSearchTerm, onFiltersChange, filters.nome_campanha]);

  const handleFilterChange = (key: keyof CampaignFilters, value: string) => {
    const newFilters = { ...filters };
    
    // Se o valor está vazio (opção "Todos os status"), remove a propriedade
    if (!value || value.trim() === '') {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSearchChange = (value: string) => {
    setLocalSearchTerm(value);
  };

  const clearFilters = () => {
    const emptyFilters = {};
    setFilters(emptyFilters);
    setLocalSearchTerm('');
    setIsSearching(false);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b border-gray-200 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {Object.values(filters).filter(v => v).length} filtro(s) ativo(s)
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-700 w-full sm:w-auto justify-center"
            >
              <X className="h-4 w-4 mr-1.5" />
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Busca por nome */}
          <div className="relative">
            {isSearching ? (
              <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 animate-spin" />
            ) : (
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            )}
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={localSearchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400 text-base"
            />
          </div>

          {/* Filtro por status */}
          <div>
            <select
              value={filters.status_campanha || ''}
              onChange={(e) => handleFilterChange('status_campanha', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-base"
            >
              <option value="" key="empty">Todos os status</option>
              {statusOptions.map((status, index) => (
                <option key={`status-${index}-${status}`} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
} 