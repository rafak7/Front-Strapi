import { Campaign, CampaignFormData, CampaignCreateData, CampaignUpdateData, CampaignFilters, CampaignApiParams } from '../types/campaign';
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

  private buildQueryParams(filters?: CampaignFilters): string {
    const queryParams = new URLSearchParams();
    let hasActiveFilters = false;

    // Verificar se há filtros ativos
    if (filters) {
      // Filtro por nome (busca case-insensitive)
      if (filters.nome_campanha && filters.nome_campanha.trim() !== '') {
        queryParams.append('filters[nome_campanha][$containsi]', filters.nome_campanha);
        hasActiveFilters = true;
      }

      // Filtro por status (match exato)
      if (filters.status_campanha && filters.status_campanha.trim() !== '') {
        queryParams.append('filters[status_campanha][$eq]', filters.status_campanha);
        hasActiveFilters = true;
      }

      // Filtro por intervalo de data da campanha
      if (filters.data_campanha_inicio && filters.data_campanha_inicio.trim() !== '') {
        queryParams.append('filters[data_campanha][$gte]', filters.data_campanha_inicio);
        hasActiveFilters = true;
      }
      if (filters.data_campanha_fim && filters.data_campanha_fim.trim() !== '') {
        queryParams.append('filters[data_campanha][$lte]', filters.data_campanha_fim);
        hasActiveFilters = true;
      }

      // Filtro por intervalo de data de criação
      if (filters.data_criacao_inicio && filters.data_criacao_inicio.trim() !== '') {
        queryParams.append('filters[createdAt][$gte]', filters.data_criacao_inicio);
        hasActiveFilters = true;
      }
      if (filters.data_criacao_fim && filters.data_criacao_fim.trim() !== '') {
        queryParams.append('filters[createdAt][$lte]', filters.data_criacao_fim);
        hasActiveFilters = true;
      }
    }

    // Adicionar ordenação padrão
    queryParams.append('sort[0]', 'createdAt:desc');

    return queryParams.toString();
  }

  private logRequest(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, status: RequestStatus, data?: any, error?: string) {
    const { setLastRequest } = useRequestStore.getState();
    const request: LastRequest = {
      method,
      endpoint,
      status,
      timestamp: Date.now(),
      data,
      error,
    };
    setLastRequest(request);
  }

  async getAll(filters?: CampaignFilters): Promise<Campaign[]> {
    const { setLoading, setCampaigns, setError } = useCampaignStore.getState();
    const queryParams = this.buildQueryParams(filters);
    const endpoint = `/campanhas${queryParams ? `?${queryParams}` : ''}`;
    
    try {
      setLoading(true);
      setError(null);
      this.logRequest('GET', endpoint, 'loading');
      
      const url = `${API_BASE_URL}/campanhas${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
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

  async getFilterOptions(): Promise<string[]> {
    const endpoint = '/campanhas/filter-options';
    
    try {
      this.logRequest('GET', endpoint, 'loading');
      
      // Retornar todos os status possíveis
      const allPossibleStatuses = ['ativa', 'inativa', 'Finalizada', 'Pausada'];
      
      this.logRequest('GET', endpoint, 'success', allPossibleStatuses);
      
      return allPossibleStatuses;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      this.logRequest('GET', endpoint, 'error', undefined, errorMessage);
      return ['ativa', 'inativa', 'Finalizada', 'Pausada']; // Retorna todos os status mesmo em caso de erro
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