'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/Layout/Layout';
import CriarCampanhaSection from '../../../components/MainContent/sections/CriarCampanhaSection';

export default function CriarCampanhaPage() {
  const router = useRouter();

  const handleCancel = () => {
    // A navegação será feita pela sidebar ou botão cancelar
  };

  const handleSuccess = () => {
    // Após sucesso, redirecionar para lista
    router.push('/');
  };

  return (
    <Layout 
      title="Criar Nova Campanha"
      subtitle="Formulário para criar uma nova campanha"
    >
      <CriarCampanhaSection
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    </Layout>
  );
} 