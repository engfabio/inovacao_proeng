import React from 'react';
import { useIdeas } from '../contexts/IdeasContext';
import { IdeaCard } from '../components/Ideas/IdeaCard';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export const MyIdeas: React.FC = () => {
  const { getMyIdeas } = useIdeas();
  const myIdeas = getMyIdeas();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Minhas Ideias</h1>
        <Link to="/new-idea" className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Nova Ideia</span>
        </Link>
      </div>

      <div className="space-y-6">
        {myIdeas.map(idea => (
          <IdeaCard key={idea.id} idea={idea} showDetails={true} />
        ))}
      </div>

      {myIdeas.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">Você ainda não submeteu nenhuma ideia.</p>
          <Link to="/new-idea" className="btn-primary">
            Submeter Primeira Ideia
          </Link>
        </div>
      )}
    </div>
  );
};