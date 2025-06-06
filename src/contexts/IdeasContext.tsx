import React, { createContext, useContext, useState, useEffect } from 'react';
import { Idea, IdeasContextType, IdeaStatus } from '../types';
import { useAuth } from './AuthContext';
import { useGamification } from './GamificationContext';
import { mockIdeas } from '../data/mockData';

const IdeasContext = createContext<IdeasContextType | undefined>(undefined);

export const useIdeas = () => {
  const context = useContext(IdeasContext);
  if (!context) {
    throw new Error('useIdeas must be used within an IdeasProvider');
  }
  return context;
};

export const IdeasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ideas, setIdeas] = useState<Idea[]>(mockIdeas);
  const { user } = useAuth();
  const { addPoints } = useGamification();

  const submitIdea = async (ideaData: Omit<Idea, 'id' | 'authorId' | 'votes' | 'voters' | 'comments' | 'status' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('Usuário não autenticado');

    const newIdea: Idea = {
      ...ideaData,
      id: Date.now().toString(),
      authorId: user.id,
      author: user,
      votes: 0,
      voters: [],
      comments: [],
      status: IdeaStatus.RECEIVED,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setIdeas([...ideas, newIdea]);
    addPoints(10); // Pontos por submeter ideia
  };

  const voteIdea = async (ideaId: string) => {
    if (!user) throw new Error('Usuário não autenticado');

    setIdeas(ideas.map(idea => {
      if (idea.id === ideaId && !idea.voters.includes(user.id)) {
        addPoints(1); // Pontos por votar
        return {
          ...idea,
          votes: idea.votes + 1,
          voters: [...idea.voters, user.id]
        };
      }
      return idea;
    }));
  };

  const addComment = async (ideaId: string, content: string) => {
    if (!user) throw new Error('Usuário não autenticado');

    const newComment = {
      id: Date.now().toString(),
      content,
      authorId: user.id,
      author: user,
      ideaId,
      createdAt: new Date()
    };

    setIdeas(ideas.map(idea => {
      if (idea.id === ideaId) {
        addPoints(3); // Pontos por comentar
        return {
          ...idea,
          comments: [...idea.comments, newComment]
        };
      }
      return idea;
    }));
  };

  const updateIdeaStatus = async (ideaId: string, status: IdeaStatus, feedback?: string) => {
    setIdeas(ideas.map(idea => {
      if (idea.id === ideaId) {
        if (status === IdeaStatus.APPROVED) {
          addPoints(50); // Pontos por ideia aprovada
        } else if (status === IdeaStatus.IMPLEMENTED) {
          addPoints(100); // Pontos por ideia implementada
        }
        return {
          ...idea,
          status,
          feedback: feedback || idea.feedback,
          updatedAt: new Date()
        };
      }
      return idea;
    }));
  };

  const getMyIdeas = () => {
    if (!user) return [];
    return ideas.filter(idea => idea.authorId === user.id);
  };

  const getTopIdeas = () => {
    return [...ideas].sort((a, b) => b.votes - a.votes).slice(0, 10);
  };

  return (
    <IdeasContext.Provider value={{
      ideas,
      submitIdea,
      voteIdea,
      addComment,
      updateIdeaStatus,
      getMyIdeas,
      getTopIdeas
    }}>
      {children}
    </IdeasContext.Provider>
  );
};