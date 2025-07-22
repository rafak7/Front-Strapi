'use client';

import React, { useState } from 'react';
import { 
  Activity, 
  Database, 
  Zap, 
  BarChart3, 
  RefreshCw,
  Plus,
  Trash2,
  Settings
} from 'lucide-react';
import Layout from '../components/Layout/Layout';
import RequestInfo from '../components/RequestInfo/RequestInfo';
import { useCampaigns } from '../hooks/useCampaigns';
import { useCampaignStore, useRequestStore } from '../stores';

export default function ExemploZustand() {
  const [showStoreData, setShowStoreData] = useState(false);
  
  // Hook personalizado
  const { 
    campaigns, 
    loading, 
    error, 
    loadCampaigns, 
    createCampaign,
    clearCampaigns,
    lastRequest,
    requestHistory 
  } = useCampaigns();

  // Acesso direto aos stores (para demonstração)
  const campaignStore = useCampaignStore();
  const requestStore = useRequestStore();

  const handleCreateExample = async () => {
    const exemplos = [
      {
        nome_campanha: 'Campanha Black Friday',
        descricao_campanha: 'Promoções especiais para Black Friday 2024',
        status_campanha: 'ativa',
        data_campanha: '2024-11-29'
      },
      {
        nome_campanha: 'Lançamento Produto X',
        descricao_campanha: 'Campanha de lançamento do novo produto',
        status_campanha: 'ativa',
        data_campanha: '2024-02-15'
      },
      {
        nome_campanha: 'Verão 2024',
        descricao_campanha: 'Coleção de verão com descontos especiais',
        status_campanha: 'Pausada',
        data_campanha: '2024-12-01'
      }
    ];

    for (const exemplo of exemplos) {
      try {
        await createCampaign(exemplo);
        // Pequeno delay para ver as requisições individuais
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Erro ao criar campanha exemplo:', error);
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">
            🚀 Demonstração Zustand
          </h1>
          <p className="text-blue-100">
            Sistema completo de gerenciamento de estado com rastreamento de requisições
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Campanhas</p>
                <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Requisições</p>
                <p className="text-2xl font-bold text-gray-900">{requestHistory.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-yellow-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? 'Loading' : 'Ready'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Última Req.</p>
                <p className="text-lg font-bold text-gray-900">
                  {lastRequest?.method || 'None'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Controles de Demonstração
          </h2>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={loadCampaigns}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Carregar Campanhas
            </button>
            
            <button
              onClick={handleCreateExample}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Exemplos
            </button>
            
            <button
              onClick={clearCampaigns}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Store
            </button>
            
            <button
              onClick={() => setShowStoreData(!showStoreData)}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Database className="h-4 w-4 mr-2" />
              {showStoreData ? 'Ocultar' : 'Mostrar'} Dados do Store
            </button>
          </div>
        </div>

        {/* Monitor de Requisições */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Monitor de Requisições em Tempo Real
          </h2>
          <RequestInfo />
        </div>

        {/* Dados do Store (Debug) */}
        {showStoreData && (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              🔍 Dados Internos dos Stores
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Campaign Store */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Campaign Store</h3>
                <pre className="bg-gray-50 p-4 rounded text-xs overflow-auto max-h-60">
                  {JSON.stringify({
                    campaigns: campaigns.slice(0, 3), // Primeiras 3 para não sobrecarregar
                    loading,
                    error,
                    totalCampaigns: campaigns.length
                  }, null, 2)}
                </pre>
              </div>
              
              {/* Request Store */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Request Store</h3>
                <pre className="bg-gray-50 p-4 rounded text-xs overflow-auto max-h-60">
                  {JSON.stringify({
                    lastRequest,
                    historyCount: requestHistory.length,
                    recentRequests: requestHistory.slice(0, 3)
                  }, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Campanhas Simplificada */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📋 Campanhas ({campaigns.length})
          </h2>
          
          {loading && (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
              <p className="text-gray-600">Carregando campanhas...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">Erro: {error}</p>
            </div>
          )}
          
          {!loading && !error && campaigns.length === 0 && (
            <div className="text-center py-8">
              <Database className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600">Nenhuma campanha encontrada</p>
              <p className="text-sm text-gray-500">Use os botões acima para carregar ou criar campanhas</p>
            </div>
          )}
          
          {!loading && campaigns.length > 0 && (
            <div className="space-y-3">
              {campaigns.slice(0, 5).map((campaign, index) => (
                <div 
                  key={campaign.id || index} 
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {campaign.nome_campanha}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {campaign.descricao_campanha}
                      </p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          campaign.status_campanha === 'ativa' 
                            ? 'bg-green-100 text-green-800'
                            : campaign.status_campanha === 'Pausada'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {campaign.status_campanha}
                        </span>
                        <span className="text-xs text-gray-500">
                          {campaign.data_campanha}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {campaigns.length > 5 && (
                <div className="text-center py-2">
                  <p className="text-sm text-gray-500">
                    ... e mais {campaigns.length - 5} campanhas
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instruções */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            📚 Como Testar
          </h2>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• <strong>Carregar Campanhas:</strong> Faz requisição GET e atualiza o store</p>
            <p>• <strong>Criar Exemplos:</strong> Cria múltiplas campanhas sequencialmente</p>
            <p>• <strong>Monitor de Requisições:</strong> Mostra status em tempo real</p>
            <p>• <strong>DevTools:</strong> Abra as DevTools do navegador para ver o Zustand</p>
            <p>• <strong>LocalStorage:</strong> Os dados persistem entre reloads</p>
          </div>
        </div>
      </div>
    </Layout>
  );
} 