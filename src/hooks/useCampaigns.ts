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

  // Carregar campanhas automaticamente na primeira vez
  useEffect(() => {
    if (campaigns.length === 0 && !loading && !error) {
      loadCampaigns();
    }
  }, []);

  // Carregar opções de filtro na primeira vez
  useEffect(() => {
    if (statusOptions.length === 0) {
      loadFilterOptions();
    }
  }, []);

  const loadCampaigns = async (filters?: CampaignFilters) => {
    try {
      await campaignApiWithStore.getAll(filters);
    } catch (error) {
      console.error('Erro ao carregar campanhas:', error);
    }
  };

  const loadFilterOptions = async () => {
    try {
      const options = await campaignApiWithStore.getFilterOptions();
      setStatusOptions(options);
    } catch (error) {
      console.error('Erro ao carregar opções de filtro:', error);
    }
  };

  const applyFilters = async (filters: CampaignFilters) => {
    setFilters(filters);
    await loadCampaigns(filters);
  };

  const refreshCampaigns = async () => {
    await loadCampaigns(currentFilters);
  };

  const createCampaign = async (campaignData: any) => {
    try {
      const newCampaign = await campaignApiWithStore.create(campaignData);
      // Recarregar opções de filtro caso tenha sido adicionado um novo status
      await loadFilterOptions();
      return newCampaign;
    } catch (error) {
      console.error('Erro ao criar campanha:', error);
      throw error;
    }
  };

  const editCampaign = async (documentId: string, campaignData: any) => {
    try {
      const updatedCampaign = await campaignApiWithStore.update(documentId, campaignData);
      // Recarregar opções de filtro caso o status tenha sido alterado
      await loadFilterOptions();
      return updatedCampaign;
    } catch (error) {
      console.error('Erro ao atualizar campanha:', error);
      throw error;
    }
  };

  const deleteCampaign = async (documentId: string) => {
    try {
      await campaignApiWithStore.delete(documentId);
      // Recarregar opções de filtro caso um status tenha ficado sem uso
      await loadFilterOptions();
    } catch (error) {
      console.error('Erro ao deletar campanha:', error);
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
    editCampaign,
    deleteCampaign,
    applyFilters,
    refreshCampaigns,
    loadFilterOptions,
    clearCampaigns,
  };
}; 