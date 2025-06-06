import React from 'react';
import { useIdeas } from '../contexts/IdeasContext';
import { IdeaCard } from '../components/Ideas/IdeaCard';
import { CheckCircle } from 'lucide-react';

export const Implemented: React.FC = () => {
  const { ideas } = useIdeas();
  const implementedIdeas = ideas.filter(idea => idea.status === 'implemented');

  return (
    <div>
      <div className="flex items-center space-x-3 mb-8">
        <CheckCircle className="w-8 h-8 text-green-600" />
        <h1 className="text-3xl font-bold text-gray-900">Ideias Implementadas</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {implementedIdeas.map(idea => (
          <IdeaCard key={idea.id} idea={idea} showDetails={true} />
        ))}
      </div>

      {implementedIdeas.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nenhuma ideia foi implementada ainda.</p>
          <p className="text-gray-500">Continue contribuindo com suas ideias!</p>
        </div>
      )}
    </div>
  );
};