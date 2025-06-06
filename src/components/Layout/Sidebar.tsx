import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Lightbulb, Plus, Trophy, CheckCircle, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/my-ideas', label: 'Minhas Ideias', icon: Lightbulb },
    { path: '/new-idea', label: 'Nova Ideia', icon: Plus },
    { path: '/ranking', label: 'Ranking', icon: Trophy },
    { path: '/implemented', label: 'Implementadas', icon: CheckCircle },
  ];

  // Adicionar item de admin se o usuário for administrador
  if (user?.email === 'admin@proeng.com') {
    menuItems.push({ path: '/admin', label: 'Painel Admin', icon: LayoutDashboard });
  }

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};