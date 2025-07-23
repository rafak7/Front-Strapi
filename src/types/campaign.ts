export interface Campaign {
  id: number;
  documentId: string;
  id_campanha?: number;
  nome_campanha: string;
  descricao_campanha: string;
  status_campanha: string;
  data_campanha: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface CampaignFormData {
  id_campanha?: number;
  nome_campanha: string;
  descricao_campanha: string;
  status_campanha: string;
  data_campanha: string;
}

export interface CampaignCreateData {
  data: {
    nome_campanha: string;
    descricao_campanha: string;
    status_campanha: string;
    data_campanha: string;
  };
}

export interface CampaignUpdateData {
  data: {
    nome_campanha?: string;
    descricao_campanha?: string;
    status_campanha?: string;
    data_campanha?: string;
  };
}

// Interfaces para filtros dinâmicos
export interface CampaignFilters {
  nome_campanha?: string;
  status_campanha?: string;
  data_campanha_inicio?: string;
  data_campanha_fim?: string;
  data_criacao_inicio?: string;
  data_criacao_fim?: string;
}

export interface CampaignFilterOptions {
  statusOptions: string[];
}

export interface CampaignApiParams {
  filters?: {
    nome_campanha?: {
      $containsi: string;
    };
    status_campanha?: {
      $eq: string;
    };
    data_campanha?: {
      $gte?: string;
      $lte?: string;
    };
    createdAt?: {
      $gte?: string;
      $lte?: string;
    };
  };
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  sort?: string[];
} 