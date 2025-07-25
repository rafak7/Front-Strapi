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
      let empresaId = null;
      
      // Se tem empresa selecionada, buscar o ID numérico dela
      if (campaignData.empresa) {
        try {
          const empresaResponse = await fetch(`${API_BASE_URL}/empresas?filters[documentId][$eq]=${campaignData.empresa}`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
          });
          
          if (empresaResponse.ok) {
            const empresaResult = await empresaResponse.json();
            if (empresaResult.data && empresaResult.data.length > 0) {
              empresaId = empresaResult.data[0].id;
            }
          }
        } catch (error) {
          // Silently continue without empresa relation
        }
      }

      // Tentar múltiplas sintaxes para a relação
      const relationshipOptions = [
        // Opção 1: ID numérico direto
        empresaId,
        // Opção 2: DocumentId direto  
        campaignData.empresa,
        // Opção 3: Objeto com connect usando documentId
        campaignData.empresa ? { connect: [{ documentId: campaignData.empresa }] } : null,
        // Opção 4: Objeto com connect usando id
        empresaId ? { connect: [{ id: empresaId }] } : null,
      ].filter(option => option !== null);

      // Tentar cada opção até uma funcionar
      for (let i = 0; i < relationshipOptions.length; i++) {
        const empresaOption = relationshipOptions[i];
        
        const payload: any = {
          data: {
            nome_campanha: campaignData.nome_campanha,
            descricao_campanha: campaignData.descricao_campanha,
            status_campanha: campaignData.status_campanha,
            data_campanha: campaignData.data_campanha,
            ...(empresaOption && { empresa: empresaOption }),
          }
        };

        const response = await fetch(`${API_BASE_URL}/campanhas`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          
          // Se não é a última tentativa, continuar
          if (i < relationshipOptions.length - 1) {
            continue;
          } else {
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
          }
        }
        
        const result = await response.json();
        
        // Fazer um GET com populate para retornar os dados completos
        const createdCampaign = await this.getById(result.data.documentId);
        
        // Se a empresa ainda está null, tentar atualizar a relação manualmente
        if (!createdCampaign.empresa && empresaId) {
          await this.establishRelationship(result.data.documentId, empresaId);
          
          // Buscar novamente
          const updatedCampaign = await this.getById(result.data.documentId);
          return updatedCampaign;
        }
        
        return createdCampaign;
      }

      throw new Error('Todas as tentativas de criar relação falharam');
    } catch (error) {
      throw error;
    }
  }

  async update(documentId: string, campaignData: Partial<CampaignFormData>): Promise<Campaign> {
    try {
      let empresaId = null;
      
      // Se tem empresa selecionada, buscar o ID numérico dela
      if (campaignData.empresa) {
        try {
          const empresaResponse = await fetch(`${API_BASE_URL}/empresas?filters[documentId][$eq]=${campaignData.empresa}`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
          });
          
          if (empresaResponse.ok) {
            const empresaResult = await empresaResponse.json();
            if (empresaResult.data && empresaResult.data.length > 0) {
              empresaId = empresaResult.data[0].id;
            }
          }
        } catch (error) {
          // Silently continue without empresa relation
        }
      }

      const payload: CampaignUpdateData = {
        data: {
          ...(campaignData.nome_campanha && { nome_campanha: campaignData.nome_campanha }),
          ...(campaignData.descricao_campanha && { descricao_campanha: campaignData.descricao_campanha }),
          ...(campaignData.status_campanha && { status_campanha: campaignData.status_campanha }),
          ...(campaignData.data_campanha && { data_campanha: campaignData.data_campanha }),
          ...(empresaId && { empresa: empresaId }),
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
      
      // Fazer um GET com populate para retornar os dados completos com a empresa
      const updatedCampaign = await this.getById(documentId);
      return updatedCampaign;
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

  // Método auxiliar para estabelecer relação manualmente
  private async establishRelationship(campanhaDocumentId: string, empresaId: number): Promise<void> {
    try {
      const updatePayload = {
        data: {
          empresa: {
            connect: [{ id: empresaId }]
          }
        }
      };

      const response = await fetch(`${API_BASE_URL}/campanhas/${campanhaDocumentId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro ao estabelecer relação manual:', errorText);
      } else {
        console.log('✅ Relação estabelecida manualmente');
      }
    } catch (error) {
      console.error('❌ Erro ao estabelecer relação manual:', error);
    }
  }

  // Método para criar campanha com nova empresa
  async createWithNewCompany(campaignData: CampaignFormData, empresaData: { nome_empresa: string; setor_empresa: string }): Promise<Campaign> {
    try {
      console.log('🏢 Criando nova empresa:', empresaData);
      
      // 1. Criar a empresa primeiro
      const empresaPayload = {
        data: {
          nome_empresa: empresaData.nome_empresa,
          setor_empresa: empresaData.setor_empresa,
        }
      };

      const empresaResponse = await fetch(`${API_BASE_URL}/empresas`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(empresaPayload),
      });

      if (!empresaResponse.ok) {
        const errorText = await empresaResponse.text();
        throw new Error(`Erro ao criar empresa: ${empresaResponse.status}, ${errorText}`);
      }

      const empresaResult = await empresaResponse.json();
      const empresaId = empresaResult.data.id;
      const empresaDocumentId = empresaResult.data.documentId;
      
      console.log('✅ Empresa criada - ID:', empresaId, 'DocumentId:', empresaDocumentId);

      // 2. Agora criar a campanha usando o ID da empresa recém-criada
      const campanhaWithEmpresa = {
        ...campaignData,
        empresa: empresaDocumentId
      };

      console.log('📝 Criando campanha com empresa recém-criada...');
      return await this.create(campanhaWithEmpresa);

    } catch (error) {
      console.error('❌ Erro ao criar campanha com nova empresa:', error);
      throw error;
    }
  }

  // Método para forçar relação diretamente no banco
  async forceRelationship(campanhaDocumentId: string, empresaDocumentId: string): Promise<Campaign> {
    try {
      console.log('🔧 Forçando relação entre campanha e empresa...');
      
      // Buscar IDs numéricos
      const [campanhaResponse, empresaResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/campanhas?filters[documentId][$eq]=${campanhaDocumentId}`, {
          headers: this.getAuthHeaders(),
        }),
        fetch(`${API_BASE_URL}/empresas?filters[documentId][$eq]=${empresaDocumentId}`, {
          headers: this.getAuthHeaders(),
        })
      ]);

      const [campanhaResult, empresaResult] = await Promise.all([
        campanhaResponse.json(),
        empresaResponse.json()
      ]);

      const campanhaId = campanhaResult.data[0]?.id;
      const empresaId = empresaResult.data[0]?.id;

      if (!campanhaId || !empresaId) {
        throw new Error('Campanha ou empresa não encontrada');
      }

      console.log('🔍 IDs encontrados - Campanha:', campanhaId, 'Empresa:', empresaId);

      // Tentar várias sintaxes de atualização
      const updateOptions = [
        { empresa: empresaId },
        { empresa: { connect: [{ id: empresaId }] } },
        { empresa: { connect: [empresaId] } },
        { empresa: { set: [{ id: empresaId }] } },
        { empresa: { set: [empresaId] } }
      ];

      for (let i = 0; i < updateOptions.length; i++) {
        const payload = { data: updateOptions[i] };
        
        console.log(`🔗 Tentativa ${i + 1} de forçar relação:`, JSON.stringify(payload, null, 2));

        const response = await fetch(`${API_BASE_URL}/campanhas/${campanhaDocumentId}`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          console.log(`✅ Relação forçada com sucesso na tentativa ${i + 1}`);
          break;
        } else {
          const errorText = await response.text();
          console.log(`❌ Tentativa ${i + 1} falhou:`, errorText);
        }
      }

      // Retornar campanha atualizada
      return await this.getById(campanhaDocumentId);

    } catch (error) {
      console.error('❌ Erro ao forçar relação:', error);
      throw error;
    }
  }
}

export const campaignApi = new CampaignApi(); 