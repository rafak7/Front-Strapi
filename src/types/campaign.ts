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