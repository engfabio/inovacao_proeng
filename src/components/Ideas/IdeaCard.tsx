import React from 'react';
import { Idea } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useIdeas } from '../../contexts/IdeasContext';
import { ThumbsUp, MessageCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface IdeaCardProps {
  idea: Idea;
  showDetails?: boolean;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea, showDetails = false }) => {
  const { user } = useAuth();
  const { voteIdea } = useIdeas();

  const hasVoted = user ? idea.voters.includes(user.id) : false;

  const handleVote = async () => {
    if (!hasVoted && user) {
      await voteIdea(idea.id);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      received: 'bg-gray-100 text-gray-800',
      analyzing: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      implemented: 'bg-purple-100 text-purple-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      received: 'Recebida',
      analyzing: 'Em Análise',
      approved: 'Aprovada',
      in_progress: 'Em Progresso',
      implemented: 'Implementada',
      rejected: 'Rejeitada'
    };
    return labels[status] || status;
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{idea.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(idea.status)}`}>
          {getStatusLabel(idea.status)}
        </span>
      </div>

      <p className="text-gray-600 mb-4">{idea.description}</p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(idea.createdAt), 'dd/MM/yyyy', { locale: ptBR })}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-medium">{idea.author?.name}</span>
          <span>•</span>
          <span>{idea.category}</span>
        </div>
      </div>

      {showDetails && (
        <>
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Benefícios Esperados:</h4>
            <p className="text-gray-600">{idea.benefits}</p>
          </div>

          {idea.feedback && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Feedback:</h4>
              <p className="text-blue-700">{idea.feedback}</p>
            </div>
          )}
        </>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleVote}
            disabled={hasVoted || !user}
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors ${
              hasVoted
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{idea.votes}</span>
          </button>

          <div className="flex items-center space-x-2 text-gray-500">
            <MessageCircle className="w-4 h-4" />
            <span>{idea.comments.length}</span>
          </div>
        </div>

        {showDetails && (
          <button className="text-primary-600 hover:text-primary-700 font-medium">
            Ver Detalhes
          </button>
        )}
      </div>
    </div>
  );
};