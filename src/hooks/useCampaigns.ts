import { useEffect } from 'react';
import { useCampaignStore } from '../stores/campaignStore';
import { useRequestStore } from '../stores/requestStore';
import { campaignApiWithStore } from '../services/campaignApiWithStore';
import { CampaignFilters } from '../types/campaign';

export const useCampaigns = () => {
  const {
    campaigns,
    loading,
    error,
    currentFilters,
    statusOptions,
    setCampaigns,
    addCampaign,
    updateCampaign,
    removeCampaign,
    setLoading,
    setError,
    setFilters,
    setStatusOptions,
    clearCampaigns,
  } = useCampaignStore();

  const { lastRequest, requestHistory } = useRequestStore();

  // Carregar campanhas automaticamente quando o componente montar
  useEffect(() => {
    if (campaigns.length === 0 && !loading && !error) {
      loadCampaigns();
    }
  }, []);

  // Carregar opções de filtro automaticamente
  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadCampaigns = async (filters?: CampaignFilters) => {
    try {
      await campaignApiWithStore.getAll(filters);
    } catch (error) {
      // Error já é tratado pelo store
    }
  };

  const loadFilterOptions = async () => {
    try {
      const statusOptions = await campaignApiWithStore.getFilterOptions();
      setStatusOptions(statusOptions);
    } catch (error) {
      // Error já é tratado pelo store
    }
  };

  const createCampaign = async (data: any) => {
    try {
      const newCampaign = await campaignApiWithStore.create(data);
      return newCampaign;
    } catch (error) {
      throw error;
    }
  };

  const updateCampaignById = async (documentId: string, data: any) => {
    try {
      const updatedCampaign = await campaignApiWithStore.update(documentId, data);
      return updatedCampaign;
    } catch (error) {
      throw error;
    }
  };

  const deleteCampaign = async (documentId: string) => {
    try {
      await campaignApiWithStore.delete(documentId);
    } catch (error) {
      throw error;
    }
  };

  const applyFilters = async (filters: CampaignFilters) => {
    try {
      setFilters(filters);
      await Promise.all([
        loadCampaigns(filters),
        loadFilterOptions()
      ]);
    } catch (error) {
      // Error já é tratado pelo store
    }
  };

  const refreshCampaigns = async () => {
    try {
      await Promise.all([
        loadCampaigns(currentFilters),
        loadFilterOptions()
      ]);
    } catch (error) {
      // Error já é tratado pelo store
    }
  };

  const getCampaignById = async (documentId: string) => {
    try {
      // Primeiro tenta encontrar nos dados já carregados
      const existingCampaign = campaigns.find(c => c.documentId === documentId);
      if (existingCampaign) {
        return existingCampaign;
      }

      // Se não encontrou, busca na API
      const campaign = await campaignApiWithStore.getById(documentId);
      return campaign;
    } catch (error) {
      throw error;
    }
  };

  return {
    // Estado
    campaigns,
    loading,
    error,
    currentFilters,
    statusOptions,
    lastRequest,
    requestHistory,

    // Ações
    loadCampaigns,
    createCampaign,
    updateCampaignById,
    deleteCampaign,
    applyFilters,
    refreshCampaigns,
    getCampaignById,
    loadFilterOptions,
    clearCampaigns,
  };
}; 