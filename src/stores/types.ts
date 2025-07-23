import { Campaign, CampaignFormData, CampaignFilters } from '../types/campaign';

// Estados da requisição
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

// Informações sobre a última requisição
export interface LastRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  status: RequestStatus;
  timestamp: number;
  data?: any;
  error?: string;
}

// Store de campanhas
export interface CampaignStore {
  // Estado
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
  currentFilters: CampaignFilters;
  statusOptions: string[];
  
  // Ações
  setCampaigns: (campaigns: Campaign[]) => void;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (documentId: string, campaign: Campaign) => void;
  removeCampaign: (documentId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: CampaignFilters) => void;
  setStatusOptions: (options: string[]) => void;
  clearCampaigns: () => void;
}

// Store de requisições
export interface RequestStore {
  // Estado
  lastRequest: LastRequest | null;
  requestHistory: LastRequest[];
  
  // Ações
  setLastRequest: (request: LastRequest) => void;
  addToHistory: (request: LastRequest) => void;
  clearHistory: () => void;
  getLastRequestByEndpoint: (endpoint: string) => LastRequest | null;
}

// Store combinado (se necessário)
export interface AppStore extends CampaignStore, RequestStore {} 