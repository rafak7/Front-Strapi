import { Campaign, CampaignFormData, CampaignCreateData, CampaignUpdateData, CampaignFilters, CampaignApiParams } from '../types/campaign';

const API_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api';
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzUzMjAyMzc1LCJleHAiOjE3NTU3OTQzNzV9._tJ1q-FVrxx1oJrsnQRErod1aQD-IunkEHdh8bWqqoo';

class CampaignApi {
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

  async getAll(filters?: CampaignFilters): Promise<Campaign[]> {
    try {
      const queryParams = this.buildQueryParams(filters);
      const populateParam = 'populate=*';
      const baseUrl = `${API_BASE_URL}/campanhas`;
      const url = queryParams 
        ? `${baseUrl}?${queryParams}&${populateParam}`
        : `${baseUrl}?${populateParam}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      throw error;
    }
  }

  async getFilterOptions(): Promise<string[]> {
    try {
      // Buscar todas as campanhas para extrair status únicos
      const response = await fetch(`${API_BASE_URL}/campanhas`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      const campaigns: Campaign[] = result.data || [];
      
      // Extrair status únicos
      const uniqueStatuses = [...new Set(campaigns.map(campaign => campaign.status_campanha))];
      return uniqueStatuses.filter(status => status && status.trim() !== '');
    } catch (error) {
      return [];
    }
  }

  async getById(id: string): Promise<Campaign> {
    try {
      const response = await fetch(`${API_BASE_URL}/campanhas/${id}?populate=*`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async create(campaignData: CampaignFormData): Promise<Campaign> {
    try {
      const payload: CampaignCreateData = {
        data: {
          nome_campanha: campaignData.nome_campanha,
          descricao_campanha: campaignData.descricao_campanha,
          status_campanha: campaignData.status_campanha,
          data_campanha: campaignData.data_campanha,
          ...(campaignData.empresa && { empresa: campaignData.empresa }),
        }
      };

      const response = await fetch(`${API_BASE_URL}/campanhas`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async update(documentId: string, campaignData: Partial<CampaignFormData>): Promise<Campaign> {
    try {
      const payload: CampaignUpdateData = {
        data: {
          ...(campaignData.nome_campanha && { nome_campanha: campaignData.nome_campanha }),
          ...(campaignData.descricao_campanha && { descricao_campanha: campaignData.descricao_campanha }),
          ...(campaignData.status_campanha && { status_campanha: campaignData.status_campanha }),
          ...(campaignData.data_campanha && { data_campanha: campaignData.data_campanha }),
          ...(campaignData.empresa && { empresa: campaignData.empresa }),
        }
      };

      const response = await fetch(`${API_BASE_URL}/campanhas/${documentId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async delete(documentId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/campanhas/${documentId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      throw error;
    }
  }
}

export const campaignApi = new CampaignApi(); 