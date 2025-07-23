'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Plus, 
  List, 
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  description?: string;
  href: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'listar',
    label: 'Listar Campanhas',
    icon: List,
    description: 'Gerenciar campanhas',
    href: '/'
  },
  {
    id: 'criar',
    label: 'Criar Campanha',
    icon: Plus,
    description: 'Nova campanha',
    href: '/campanhas/criar'
  }
];

export default function Sidebar({ 
  isOpen = true, 
  onClose 
}: SidebarProps) {
  const pathname = usePathname();
  
  const handleMenuClick = () => {
    // Fechar sidebar no mobile após seleção
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && onClose && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        w-64 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Header da sidebar com botão de fechar no mobile */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || 
                             (item.href === '/' && pathname === '/') ||
                             (item.href === '/campanhas/criar' && pathname.startsWith('/campanhas/criar'));
              
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={handleMenuClick}
                    className={`w-full flex items-center px-3 py-3 rounded-lg text-left transition-colors ${
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
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
} 