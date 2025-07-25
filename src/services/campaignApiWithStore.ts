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

  async getAllSilent(filters?: CampaignFilters): Promise<Campaign[]> {
    const { setCampaigns } = useCampaignStore.getState();
    const queryParams = this.buildQueryParams(filters);
    const endpoint = `/campanhas${queryParams ? `?${queryParams}` : ''}`;
    
    try {
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
      this.logRequest('GET', endpoint, 'error', undefined, errorMessage);
      throw error;
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
      
      // Se não tem empresa selecionada, criar sem relação
      if (!campaignData.empresa) {
        const payload = {
          data: {
            nome_campanha: campaignData.nome_campanha,
            descricao_campanha: campaignData.descricao_campanha,
            status_campanha: campaignData.status_campanha,
            data_campanha: campaignData.data_campanha,
          }
        };

        console.log('📤 Criando campanha SEM empresa:', JSON.stringify(payload, null, 2));

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
      }

      // Verificar se a empresa existe
      console.log('🔍 Verificando empresa com documentId:', campaignData.empresa);
      
      const empresaResponse = await fetch(`${API_BASE_URL}/empresas?filters[documentId][$eq]=${campaignData.empresa}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      if (!empresaResponse.ok) {
        throw new Error('Erro ao buscar empresa');
      }
      
      const empresaResult = await empresaResponse.json();
      if (!empresaResult.data || empresaResult.data.length === 0) {
        throw new Error(`Empresa não encontrada com documentId: ${campaignData.empresa}`);
      }
      
      const empresa = empresaResult.data[0];
      console.log('🏢 Empresa encontrada:', empresa);

      // Tentar sintaxes do Strapi v5 conforme documentação oficial
      const relationshipOptions = [
        // Opção 1: DocumentId direto (sintaxe mais simples para Many-to-One)
        campaignData.empresa,
        
        // Opção 2: Usando connect com documentId (sintaxe completa)
        {
          connect: [{ documentId: campaignData.empresa }]
        },
        
        // Opção 3: Usando connect sem array (para relação única)
        {
          connect: { documentId: campaignData.empresa }
        },
      ];

      console.log('🔗 Testando sintaxes do Strapi v5 para relação empresa-campanha');

      // Tentar cada opção conforme documentação oficial
      for (let i = 0; i < relationshipOptions.length; i++) {
        const empresaOption = relationshipOptions[i];
        
        const payload = {
          data: {
            nome_campanha: campaignData.nome_campanha,
            descricao_campanha: campaignData.descricao_campanha,
            status_campanha: campaignData.status_campanha,
            data_campanha: campaignData.data_campanha,
            empresa: empresaOption,
          }
        };

        console.log(`📤 Tentativa ${i + 1}/${relationshipOptions.length} - Sintaxe Strapi v5:`, JSON.stringify(payload, null, 2));

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`❌ Tentativa ${i + 1} falhou:`, errorText);
          
          // Se não é a última tentativa, continuar
          if (i < relationshipOptions.length - 1) {
            continue;
          } else {
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
          }
        }
        
        const result = await response.json();
        console.log(`✅ Sucesso na tentativa ${i + 1}! Resposta do Strapi:`, JSON.stringify(result, null, 2));
        
        // Buscar a campanha criada com populate para verificar se a relação foi estabelecida
        const createdCampaign = await this.getByIdWithPopulate(result.data.documentId);
        console.log('📥 Campanha criada com populate:', JSON.stringify(createdCampaign, null, 2));
        
        // Verificar se a empresa foi relacionada corretamente
        if (createdCampaign.empresa) {
          console.log('🎉 SUCESSO! Relação empresa-campanha criada corretamente!');
          console.log('🏢 Empresa relacionada:', createdCampaign.empresa);
        } else {
          console.warn('⚠️ Campanha criada mas empresa ainda está null');
        }
        
        addCampaign(createdCampaign);
        this.logRequest('POST', endpoint, 'success', createdCampaign);
        return createdCampaign;
      }

      throw new Error('Todas as tentativas de criar relação falharam');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      this.logRequest('POST', endpoint, 'error', undefined, errorMessage);
      console.error('❌ Erro ao criar campanha:', error);
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

  // Método auxiliar para buscar campanha com populate
  private async getByIdWithPopulate(documentId: string): Promise<Campaign> {
    try {
      const response = await fetch(`${API_BASE_URL}/campanhas/${documentId}?populate=*`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('❌ Erro ao buscar campanha com populate:', error);
      throw error;
    }
  }

}

export const campaignApiWithStore = new CampaignApiWithStore(); 