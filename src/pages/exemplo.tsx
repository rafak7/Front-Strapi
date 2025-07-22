'use client';

import React from 'react';
import { useCampaigns } from '../hooks/useCampaigns';
import RequestInfo from '../components/RequestInfo/RequestInfo';

export default function ExemploSimples() {
  const { 
    campaigns, 
    loading, 
    error, 
    loadCampaigns, 
    createCampaign,
    lastRequest,
    requestHistory 
  } = useCampaigns();

  const handleNovaCampanha = async () => {
    await createCampaign({
      nome_campanha: 'Nova Campanha',
      descricao_campanha: 'Descrição da campanha',
      status_campanha: 'ativa',
      data_campanha: '2024-01-15'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Exemplo Simples do Zustand
        </h1>
        
        {/* Monitor de Requisições */}
        <RequestInfo />
        
        {/* Interface das Campanhas */}
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex gap-4 mb-6">
            <button 
              onClick={handleNovaCampanha}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Criar Campanha
            </button>
            
            <button 
              onClick={loadCampaigns}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Recarregar ({campaigns.length} campanhas)
            </button>
          </div>
          
          {loading && <p>Carregando...</p>}
          {error && <p className="text-red-600">Erro: {error}</p>}
          
          <div className="space-y-2">
            {campaigns.map(campaign => (
              <div key={campaign.id} className="p-3 border rounded">
                {campaign.nome_campanha}
              </div>
            ))}
          </div>
        </div>
        
        {/* Informações de Debug */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-3">Debug Info:</h3>
          <p><strong>Última requisição:</strong> {lastRequest?.method} {lastRequest?.endpoint}</p>
          <p><strong>Status:</strong> {lastRequest?.status}</p>
          <p><strong>Histórico:</strong> {requestHistory.length} requisições</p>
        </div>
      </div>
    </div>
  );
} 