import React, { createContext, useContext, useState, useEffect } from 'react';
import { Badge, GamificationContextType, User } from '../types';
import { useAuth } from './AuthContext';
import { mockUsers } from '../data/mockData';

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};

const levelThresholds = [0, 100, 500, 1000, 2000];
const levelNames = ['Iniciante', 'Colaborador', 'Inovador', 'Visionário', 'Líder de Inovação'];

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userPoints, setUserPoints] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [userBadges, setUserBadges] = useState<Badge[]>([]);
  const [ranking, setRanking] = useState<User[]>([]);

  useEffect(() => {
    if (user) {
      setUserPoints(user.points);
      setUserLevel(user.level);
      setUserBadges(user.badges);
    }
    updateRanking();
  }, [user]);

  const updateRanking = () => {
    const sortedUsers = [...mockUsers].sort((a, b) => b.points - a.points);
    setRanking(sortedUsers);
  };

  const addPoints = (points: number) => {
    const newPoints = userPoints + points;
    setUserPoints(newPoints);

    // Verificar novo nível
    let newLevel = 1;
    for (let i = levelThresholds.length - 1; i >= 0; i--) {
      if (newPoints >= levelThresholds[i]) {
        newLevel = i + 1;
        break;
      }
    }
    
    if (newLevel > userLevel) {
      setUserLevel(newLevel);
      // Adicionar badge de novo nível
      const levelBadge: Badge = {
        id: `level-${newLevel}`,
        name: `Nível ${newLevel}: ${levelNames[newLevel - 1]}`,
        description: `Alcançou o nível ${newLevel}`,
        icon: '🎯',
        unlockedAt: new Date()
      };
      setUserBadges([...userBadges, levelBadge]);
    }

    // Atualizar usuário no localStorage
    if (user) {
      const updatedUser = { ...user, points: newPoints, level: newLevel };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    updateRanking();
  };

  const checkAndUnlockBadges = () => {
    // Lógica para verificar e desbloquear badges baseado em conquistas específicas
    // Por exemplo: primeira ideia, 10 votos recebidos, etc.
  };

  return (
    <GamificationContext.Provider value={{
      userPoints,
      userLevel,
      userBadges,
      ranking,
      addPoints,
      checkAndUnlockBadges
    }}>
      {children}
    </GamificationContext.Provider>
  );
};