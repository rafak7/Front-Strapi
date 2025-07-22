'use client';

import React from 'react';
import { 
  Plus, 
  List, 
  Settings
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  description?: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'listar',
    label: 'Listar Campanhas',
    icon: List,
    description: 'Gerenciar campanhas'
  },
  {
    id: 'criar',
    label: 'Criar Campanha',
    icon: Plus,
    description: 'Nova campanha'
  }
];

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon 
                    className={`h-5 w-5 mr-3 ${
                      isActive ? 'text-blue-600' : 'text-gray-400'
                    }`} 
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {item.label}
                    </div>
                    {item.description && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </div>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
} 