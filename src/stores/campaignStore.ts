import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { CampaignStore } from './types';
import { Campaign, CampaignFilters } from '../types/campaign';

export const useCampaignStore = create<CampaignStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Estado inicial
        campaigns: [],
        loading: false,
        error: null,
        currentFilters: {},
        statusOptions: ['ativa', 'inativa', 'Finalizada', 'Pausada'],

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

        setFilters: (filters: CampaignFilters) =>
          set((state) => {
            state.currentFilters = filters;
          }, false, 'setFilters'),

        setStatusOptions: (options: string[]) =>
          set((state) => {
            state.statusOptions = options;
          }, false, 'setStatusOptions'),

        clearCampaigns: () =>
          set((state) => {
            state.campaigns = [];
            state.error = null;
            state.currentFilters = {};
          }, false, 'clearCampaigns'),
      })),
      {
        name: 'campaign-store',
        partialize: (state) => ({
          currentFilters: state.currentFilters,
          statusOptions: state.statusOptions,
        }),
      }
    ),
    {
      name: 'CampaignStore',
    }
  )
); 