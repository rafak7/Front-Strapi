import { useEffect } from 'react';
import { useCampaignStore } from '../stores/campaignStore';
import { useRequestStore } from '../stores/requestStore';
import { campaignApiWithStore } from '../services/campaignApiWithStore';

export const useCampaigns = () => {
  const {
    campaigns,
    loading,
    error,
    setCampaigns,
    addCampaign,
    updateCampaign,
    removeCampaign,
    setLoading,
    setError,
    clearCampaigns,
  } = useCampaignStore();

  const { lastRequest, requestHistory } = useRequestStore();

  // Carregar campanhas automaticamente na primeira vez
  useEffect(() => {
    if (campaigns.length === 0 && !loading && !error) {
      loadCampaigns();
    }
  }, []);

  const loadCampaigns = async () => {
    try {
      await campaignApiWithStore.getAll();
    } catch (error) {
      console.error('Erro ao carregar campanhas:', error);
    }
  };

  const createCampaign = async (campaignData: any) => {
    try {
      const newCampaign = await campaignApiWithStore.create(campaignData);
      return newCampaign;
    } catch (error) {
      console.error('Erro ao criar campanha:', error);
      throw error;
    }
  };

  const editCampaign = async (documentId: string, campaignData: any) => {
    try {
      const updatedCampaign = await campaignApiWithStore.update(documentId, campaignData);
      return updatedCampaign;
    } catch (error) {
      console.error('Erro ao atualizar campanha:', error);
      throw error;
    }
  };

  const deleteCampaign = async (documentId: string) => {
    try {
      await campaignApiWithStore.delete(documentId);
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
    lastRequest,
    requestHistory,

    // Ações
    loadCampaigns,
    createCampaign,
    editCampaign,
    deleteCampaign,
    clearCampaigns,
  };
}; 