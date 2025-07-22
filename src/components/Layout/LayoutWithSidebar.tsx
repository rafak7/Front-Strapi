'use client';

import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';

interface LayoutWithSidebarProps {
  children?: React.ReactNode;
  initialSection?: string;
}

export default function LayoutWithSidebar({ 
  children, 
  initialSection = 'listar' 
}: LayoutWithSidebarProps) {
  const [activeSection, setActiveSection] = useState(initialSection);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
                             <h1 className="text-xl font-semibold text-gray-900">
                 {activeSection === 'criar' && 'Criar Nova Campanha'}
                 {activeSection === 'listar' && 'Gerenciar Campanhas'}
               </h1>
               <p className="text-sm text-gray-600 mt-1">
                 {activeSection === 'criar' && 'Formulário para criar uma nova campanha'}
                 {activeSection === 'listar' && 'Lista e gerenciamento de todas as campanhas'}
               </p>
            </div>
          </div>
        </header>

                 {/* Content */}
         <main className="flex-1 p-6">
           {children && React.isValidElement(children) 
             ? React.cloneElement(children as any, { 
                 activeSection,
                 onSectionChange: setActiveSection 
               })
             : children
           }
         </main>
      </div>
    </div>
  );
} 