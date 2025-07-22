import { Campaign, CampaignFormData, CampaignCreateData, CampaignUpdateData } from '../types/campaign';
import { useCampaignStore } from '../stores/campaignStore';
import { useRequestStore } from '../stores/requestStore';
import { LastRequest, RequestStatus } from '../stores/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api';
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzUzMjAyMzc1LCJleHAiOjE3NTU3OTQzNzV9._tJ1q-FVrxx1oJrsnQRErod1aQD-IunkEHdh8bWqqoo';

class CampaignApiWithStore {
  private getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JWT_TOKEN}`,
    };
  }

  private logRequest(method: LastRequest['method'], endpoint: string, status: RequestStatus, data?: any, error?: string) {
    const request: LastRequest = {
      method,
      endpoint,
      status,
      timestamp: Date.now(),
      data: status === 'success' ? data : undefined,
      error: status === 'error' ? error : undefined,
    };

    // Atualiza o store de requisições
    useRequestStore.getState().setLastRequest(request);
  }

  async getAll(): Promise<Campaign[]> {
    const { setLoading, setCampaigns, setError } = useCampaignStore.getState();
    const endpoint = '/campanhas';
    
    try {
      setLoading(true);
      setError(null);
      this.logRequest('GET', endpoint, 'loading');
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      const campaigns = result.data || [];
      
      setCampaigns(campaigns);
      this.logRequest('GET', endpoint, 'success', campaigns);
      
      return campaigns;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      this.logRequest('GET', endpoint, 'error', undefined, errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async getById(id: string): Promise<Campaign> {
    const { setLoading, setError } = useCampaignStore.getState();
    const endpoint = `/campanhas/${id}`;
    
    try {
      setLoading(true);
      setError(null);
      this.logRequest('GET', endpoint, 'loading');
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      const campaign = result.data;
      
      this.logRequest('GET', endpoint, 'success', campaign);
      
      return campaign;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      this.logRequest('GET', endpoint, 'error', undefined, errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async create(campaignData: CampaignFormData): Promise<Campaign> {
    const { setLoading, addCampaign, setError } = useCampaignStore.getState();
    const endpoint = '/campanhas';
    
    try {
      setLoading(true);
      setError(null);
      this.logRequest('POST', endpoint, 'loading');
      
      const payload: CampaignCreateData = {
        data: {
          nome_campanha: campaignData.nome_campanha,
          descricao_campanha: campaignData.descricao_campanha,
          status_campanha: campaignData.status_campanha,
          data_campanha: campaignData.data_campanha,
        }
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const result = await response.json();
      const campaign = result.data;
      
      addCampaign(campaign);
      this.logRequest('POST', endpoint, 'success', campaign);
      
      return campaign;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      this.logRequest('POST', endpoint, 'error', undefined, errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async update(documentId: string, campaignData: Partial<CampaignFormData>): Promise<Campaign> {
    const { setLoading, updateCampaign, setError } = useCampaignStore.getState();
    const endpoint = `/campanhas/${documentId}`;
    
    try {
      setLoading(true);
      setError(null);
      this.logRequest('PUT', endpoint, 'loading');
      
      const payload: CampaignUpdateData = {
        data: {
          ...(campaignData.nome_campanha && { nome_campanha: campaignData.nome_campanha }),
          ...(campaignData.descricao_campanha && { descricao_campanha: campaignData.descricao_campanha }),
          ...(campaignData.status_campanha && { status_campanha: campaignData.status_campanha }),
          ...(campaignData.data_campanha && { data_campanha: campaignData.data_campanha }),
        }
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      const campaign = result.data;
      
      updateCampaign(documentId, campaign);
      this.logRequest('PUT', endpoint, 'success', campaign);
      
      return campaign;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      this.logRequest('PUT', endpoint, 'error', undefined, errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async delete(documentId: string): Promise<void> {
    const { setLoading, removeCampaign, setError } = useCampaignStore.getState();
    const endpoint = `/campanhas/${documentId}`;
    
    try {
      setLoading(true);
      setError(null);
      this.logRequest('DELETE', endpoint, 'loading');
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      removeCampaign(documentId);
      this.logRequest('DELETE', endpoint, 'success');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      this.logRequest('DELETE', endpoint, 'error', undefined, errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }
}

export const campaignApiWithStore = new CampaignApiWithStore(); 