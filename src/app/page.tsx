'use client';

import React, { useEffect } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import Layout from '../components/Layout/Layout';
import ListarCampanhasSection from '../components/MainContent/sections/ListarCampanhasSection';
import { useCampaigns } from '../hooks/useCampaigns';

export default function HomePage() {
  const { refreshCampaignsSilent } = useCampaigns();

  // Atualizar cache sempre que voltar para a página de campanhas
  useEffect(() => {
    refreshCampaignsSilent();
  }, []);

  const headerActions = (
    <Link
      href="/campanhas/criar"
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
    >
      <Plus className="h-4 w-4 mr-2" />
      Nova Campanha
    </Link>
  );

  return (
    <>
      <Layout 
        title="Gerenciar Campanhas"
        subtitle="Lista e gerenciamento de todas as campanhas"
        headerActions={headerActions}
      >
        <ListarCampanhasSection />
      </Layout>

      {/* Floating Action Button (mobile) */}
      <div className="fixed bottom-6 right-6 sm:hidden z-50">
        <Link
          href="/campanhas/criar"
          className="inline-flex items-center justify-center w-14 h-14 text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="h-6 w-6" />
        </Link>
      </div>
    </>
  );
} 