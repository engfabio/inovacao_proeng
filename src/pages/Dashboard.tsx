import React from 'react';
import { useIdeas } from '../contexts/IdeasContext';
import { IdeaCard } from '../components/Ideas/IdeaCard';
import { RankingWidget } from '../components/Ranking/RankingWidget';
import { TrendingUp, Lightbulb, Award } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { getTopIdeas, ideas } = useIdeas();
  const topIdeas = getTopIdeas();

  const stats = {
    totalIdeas: ideas.length,
    implementedIdeas: ideas.filter(i => i.status === 'implemented').length,
    activeVotes: ideas.reduce((sum, idea) => sum + idea.votes, 0)
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Ideias Mais Votadas</h1>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Ideias</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalIdeas}</p>
            </div>
            <Lightbulb className="w-8 h-8 text-primary-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Implementadas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.implementedIdeas}</p>
            </div>
            <Award className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Votos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeVotes}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-secondary-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">💡 Ideias Mais Votadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topIdeas.map(idea => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>

          {topIdeas.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">Nenhuma ideia foi submetida ainda.</p>
              <p className="text-gray-500">Seja o primeiro a compartilhar suas ideias!</p>
            </div>
          )}
        </div>

        <div>
          <RankingWidget />
        </div>
      </div>
    </div>
  );
};