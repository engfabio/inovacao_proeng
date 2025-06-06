import React, { useState } from 'react';
import { Settings, BarChart3 } from 'lucide-react';
import { KanbanBoard } from './KanbanBoard';
import { AISettings } from './AISettings';

type TabType = 'kanban' | 'ai-settings' | 'analytics';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
}

const tabs: Tab[] = [
  {
    id: 'kanban',
    label: 'Gestão de Ideias',
    icon: BarChart3,
    component: KanbanBoard
  },
  {
    id: 'ai-settings',
    label: 'Configurações de IA',
    icon: Settings,
    component: AISettings
  }
];

export const AdminTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('kanban');

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || KanbanBoard;

  return (
    <div className="space-y-6">
      {/* Título do Painel */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
        <p className="text-gray-600 mt-2">
          Gerencie ideias, configure a IA e monitore o sistema de inovação.
        </p>
      </div>

      {/* Navegação por Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>        {/* Conteúdo da Tab Ativa */}
        <div className="p-0">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};
