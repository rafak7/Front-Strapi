'use client';

import React from 'react';
import LayoutWithSidebar from '../components/Layout/LayoutWithSidebar';
import MainContent from '../components/MainContent/MainContent';

export default function HomePage() {
  return (
    <LayoutWithSidebar>
      <MainContent activeSection="listar" onSectionChange={() => {}} />
    </LayoutWithSidebar>
  );
} 