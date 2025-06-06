import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import { User, Trophy, Award, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const { userPoints, userLevel, userBadges } = useGamification();

  if (!user) return null;

  const levelNames = ['Iniciante', 'Colaborador', 'Inovador', 'Visionário', 'Líder de Inovação'];
  const levelThresholds = [0, 100, 500, 1000, 2000];
  const nextLevelPoints = userLevel < 5 ? levelThresholds[userLevel] : null;
  const progressPercentage = nextLevelPoints 
    ? ((userPoints - levelThresholds[userLevel - 1]) / (nextLevelPoints - levelThresholds[userLevel - 1])) * 100
    : 100;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Meu Perfil</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start space-x-6">
          <div className="bg-primary-100 rounded-full p-6">
            <User className="w-12 h-12 text-primary-600" />
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <div className="mt-2 space-y-1 text-gray-600">
              <p>{user.position} - {user.department}</p>
              <p>{user.email}</p>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Membro desde {format(new Date(user.createdAt), 'MMMM yyyy', { locale: ptBR })}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-primary-600">{userPoints}</div>
            <div className="text-sm text-gray-600">pontos totais</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-primary-600" />
            <span>Nível de Experiência</span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl font-bold text-primary-600">
                  Nível {userLevel}: {levelNames[userLevel - 1]}
                </span>
              </div>
              
              {nextLevelPoints && (
                <>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    {userPoints} / {nextLevelPoints} pontos para o próximo nível
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Award className="w-5 h-5 text-primary-600" />
            <span>Conquistas Desbloqueadas</span>
          </h3>
          
          <div className="grid grid-cols-4 gap-4">
            {userBadges.map(badge => (
              <div
                key={badge.id}
                className="text-center"
                title={`${badge.name}: ${badge.description}`}
              >
                <div className="text-3xl mb-1">{badge.icon}</div>
                <p className="text-xs text-gray-600">{badge.name}</p>
              </div>
            ))}
          </div>
          
          {userBadges.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Continue participando para desbloquear conquistas!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};