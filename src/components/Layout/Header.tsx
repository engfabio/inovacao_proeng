import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useGamification } from '../../contexts/GamificationContext';
import { LogOut, Trophy, User } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { userPoints, userLevel } = useGamification();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const levelNames = ['Iniciante', 'Colaborador', 'Inovador', 'Visionário', 'Líder de Inovação'];

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-primary-600">Inovação Corporativa</h1>
          </Link>

          {user && (
            <div className="flex items-center space-x-6">
              <Link to="/ranking" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                <Trophy className="w-5 h-5" />
                <span className="font-medium">{userPoints} pontos</span>
              </Link>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Nível {userLevel}:</span>
                <span className="font-medium text-primary-600">{levelNames[userLevel - 1]}</span>
              </div>

              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                  <User className="w-5 h-5" />
                  <span>{user.name}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};