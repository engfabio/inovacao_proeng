import React from 'react';
import { useGamification } from '../../contexts/GamificationContext';
import { Trophy, Medal, Award } from 'lucide-react';

export const RankingWidget: React.FC = () => {
  const { ranking } = useGamification();
  const topUsers = ranking.slice(0, 5);

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">{position}</span>;
    }
  };

  const getRankColor = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default:
        return 'bg-gradient-to-r from-blue-400 to-blue-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">🏆 Ranking Top 5</h3>
        <Trophy className="w-6 h-6 text-yellow-500" />
      </div>

      <div className="space-y-3">
        {topUsers.map((user, index) => {
          const position = index + 1;
          return (
            <div
              key={user.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                position <= 3 ? 'bg-gradient-to-r from-gray-50 to-gray-100' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8">
                  {getRankIcon(position)}
                </div>
                
                <div>
                  <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.department}</p>
                </div>
              </div>

              <div className="text-right">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${getRankColor(position)}`}>
                  {user.points} pts
                </div>
                <p className="text-xs text-gray-500 mt-1">Nível {user.level}</p>
              </div>
            </div>
          );
        })}
      </div>

      {topUsers.length === 0 && (
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Nenhum usuário no ranking ainda</p>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <a
          href="/ranking"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center justify-center"
        >
          Ver ranking completo →
        </a>
      </div>
    </div>
  );
};
