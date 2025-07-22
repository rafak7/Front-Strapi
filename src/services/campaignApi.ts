import { Campaign, CampaignFormData, CampaignCreateData, CampaignUpdateData } from '../types/campaign';

const API_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api';
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzUzMjAyMzc1LCJleHAiOjE3NTU3OTQzNzV9._tJ1q-FVrxx1oJrsnQRErod1aQD-IunkEHdh8bWqqoo';

class CampaignApi {
  private getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JWT_TOKEN}`,
    };
  }


  async getAll(): Promise<Campaign[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/campanhas`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Erro ao buscar campanhas:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Campaign> {
    try {
      const response = await fetch(`${API_BASE_URL}/campanhas/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Erro ao buscar campanha:', error);
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
        }
      };

      const response = await fetch(`${API_BASE_URL}/campanhas`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Erro ao criar campanha:', error);
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
      console.error('Erro ao atualizar campanha:', error);
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
      console.error('Erro ao excluir campanha:', error);
      throw error;
    }
  }
}

export const campaignApi = new CampaignApi(); 