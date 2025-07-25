'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '../../../../components/Layout/Layout';
import CriarCampanhaSection from '../../../../components/MainContent/sections/CriarCampanhaSection';
import { useCampaigns } from '../../../../hooks/useCampaigns';
import { Campaign } from '../../../../types/campaign';

export default function EditarCampanhaPage() {
  const params = useParams();
  const router = useRouter();
  const { getCampaignById, loading: campaignsLoading } = useCampaigns();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCampaign = async () => {
      if (!params.id) {
        setError('ID da campanha não encontrado');
        setLoading(false);
        return;
      }

      try {
        const foundCampaign = await getCampaignById(params.id as string);
        setCampaign(foundCampaign);
      } catch (err) {
        setError('Campanha não encontrada');
      } finally {
        setLoading(false);
      }
    };

    loadCampaign();
  }, [params.id, getCampaignById]);

  const handleCancel = () => {
    router.push('/');
  };

  const handleSuccess = () => {
    router.push('/');
  };

  if (loading || campaignsLoading) {
    return (
      <Layout title="Carregando..." subtitle="Carregando dados da campanha">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Carregando campanha...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Erro" subtitle="Erro ao carregar campanha">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button 
              onClick={() => router.push('/')}
              className="inline-block mt-2 text-red-600 hover:text-red-800 underline"
            >
              Voltar para lista de campanhas
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="Editar Campanha"
      subtitle={campaign?.nome_campanha ? `Editando: ${campaign.nome_campanha}` : 'Modificando dados da campanha'}
    >
      <CriarCampanhaSection
        editingCampaign={campaign}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    </Layout>
  );
} 