import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { CampaignStore } from './types';
import { Campaign } from '../types/campaign';

export const useCampaignStore = create<CampaignStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Estado inicial
        campaigns: [],
        loading: false,
        error: null,

        // Ações
        setCampaigns: (campaigns: Campaign[]) =>
          set((state) => {
            state.campaigns = campaigns;
            state.error = null;
          }, false, 'setCampaigns'),

        addCampaign: (campaign: Campaign) =>
          set((state) => {
            state.campaigns.unshift(campaign); // Adiciona no início da lista
          }, false, 'addCampaign'),

        updateCampaign: (documentId: string, updatedCampaign: Campaign) =>
          set((state) => {
            const index = state.campaigns.findIndex((c: Campaign) => c.documentId === documentId);
            if (index !== -1) {
              state.campaigns[index] = updatedCampaign;
            }
          }, false, 'updateCampaign'),

        removeCampaign: (documentId: string) =>
          set((state) => {
            state.campaigns = state.campaigns.filter((c: Campaign) => c.documentId !== documentId);
          }, false, 'removeCampaign'),

        setLoading: (loading: boolean) =>
          set((state) => {
            state.loading = loading;
          }, false, 'setLoading'),

        setError: (error: string | null) =>
          set((state) => {
            state.error = error;
          }, false, 'setError'),

        clearCampaigns: () =>
          set((state) => {
            state.campaigns = [];
            state.error = null;
          }, false, 'clearCampaigns'),
      })),
      {
        name: 'campaign-store', // Nome para localStorage
        partialize: (state) => ({
          campaigns: state.campaigns, // Apenas persiste as campanhas
        }),
      }
    ),
    {
      name: 'CampaignStore', // Nome para devtools
    }
  )
); 