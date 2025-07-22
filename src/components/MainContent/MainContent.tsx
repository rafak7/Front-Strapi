'use client';

import React, { useState } from 'react';
import { Campaign } from '../../types/campaign';

// Seções - apenas as essenciais
import CriarCampanhaSection from '../MainContent/sections/CriarCampanhaSection';
import ListarCampanhasSection from '../MainContent/sections/ListarCampanhasSection';

interface MainContentProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function MainContent({ activeSection, onSectionChange }: MainContentProps) {
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    onSectionChange('criar');
  };

  const handleCancelEdit = () => {
    setEditingCampaign(null);
  };

  const handleCampaignCreated = () => {
    setEditingCampaign(null);
    onSectionChange('listar');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'criar':
        return (
          <CriarCampanhaSection
            editingCampaign={editingCampaign}
            onCancel={handleCancelEdit}
            onSuccess={handleCampaignCreated}
          />
        );
      
      case 'listar':
      default:
        return <ListarCampanhasSection onEdit={handleEditCampaign} />;
    }
  };

  return (
    <div className="h-full">
      {renderSection()}
    </div>
  );
} 