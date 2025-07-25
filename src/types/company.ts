export interface Company {
  id: number;
  documentId: string;
  nome_empresa: string;
  setor_empresa: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface CompanyFormData {
  nome_empresa: string;
  setor_empresa: string;
}

export interface CompanyCreateData {
  data: {
    nome_empresa: string;
    setor_empresa: string;
  };
} 