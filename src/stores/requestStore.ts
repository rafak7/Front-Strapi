import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { RequestStore, LastRequest } from './types';

export const useRequestStore = create<RequestStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Estado inicial
        lastRequest: null,
        requestHistory: [],

        // Ações
        setLastRequest: (request: LastRequest) =>
          set((state) => {
            state.lastRequest = request;
            // Também adiciona ao histórico
            state.requestHistory.unshift(request);
            // Mantém apenas os últimos 50 requests no histórico
            if (state.requestHistory.length > 50) {
              state.requestHistory = state.requestHistory.slice(0, 50);
            }
          }, false, 'setLastRequest'),

        addToHistory: (request: LastRequest) =>
          set((state) => {
            state.requestHistory.unshift(request);
            if (state.requestHistory.length > 50) {
              state.requestHistory = state.requestHistory.slice(0, 50);
            }
          }, false, 'addToHistory'),

        clearHistory: () =>
          set((state) => {
            state.requestHistory = [];
            state.lastRequest = null;
          }, false, 'clearHistory'),

        getLastRequestByEndpoint: (endpoint: string) => {
          const state = get();
          return state.requestHistory.find(req => req.endpoint === endpoint) || null;
        },
      })),
      {
        name: 'request-store',
        partialize: (state) => ({
          lastRequest: state.lastRequest,
          requestHistory: state.requestHistory.slice(0, 10), // Persiste apenas os últimos 10
        }),
      }
    ),
    {
      name: 'RequestStore',
    }
  )
); 