'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '../Sidebar/Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

export default function Layout({ children, title, subtitle, headerActions }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Menu button for mobile e título */}
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors mr-3"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Ações do header */}
            {headerActions && (
              <div className="hidden sm:block">
                {headerActions}
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 