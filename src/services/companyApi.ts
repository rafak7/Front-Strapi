import { Company, CompanyFormData, CompanyCreateData } from '../types/company';

const API_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api';
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzUzMjAyMzc1LCJleHAiOjE3NTU3OTQzNzV9._tJ1q-FVrxx1oJrsnQRErod1aQD-IunkEHdh8bWqqoo';

class CompanyApi {
  private getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JWT_TOKEN}`,
    };
  }

  async getAll(): Promise<Company[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/empresas`, {
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

  async create(companyData: CompanyFormData): Promise<Company> {
    try {
      const payload: CompanyCreateData = {
        data: {
          nome_empresa: companyData.nome_empresa,
          setor_empresa: companyData.setor_empresa,
        }
      };

      const response = await fetch(`${API_BASE_URL}/empresas`, {
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
}

export const companyApi = new CompanyApi(); 