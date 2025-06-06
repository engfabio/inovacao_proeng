import React, { useState } from 'react';
import { useIdeas } from '../../contexts/IdeasContext';
import { useAuth } from '../../contexts/AuthContext';
import { IdeaStatus, Idea, Comment } from '../../types';
import { 
  User, Calendar, Edit2, X, Save, UserPlus, Tag, 
  Clock, Paperclip, MessageSquare, CheckSquare, MoreHorizontal, 
  List, AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Componente separado para o modal de detalhes
const IdeaDetailModal: React.FC<{
  ideaId: string;
  onClose: () => void;
  onUpdate: (ideaId: string, updates: Partial<Idea>) => void;
}> = ({ ideaId, onClose, onUpdate }) => {
  const { ideas, updateIdeaStatus } = useIdeas();
  const idea = ideas.find(i => i.id === ideaId);

  const [editableTitle, setEditableTitle] = useState(idea?.title || '');
  const [editableDescription, setEditableDescription] = useState(idea?.description || '');
  const [editableBenefits, setEditableBenefits] = useState(idea?.benefits || '');
  const [editableAssignee, setEditableAssignee] = useState(idea?.assignee || '');
  const [editableTags, setEditableTags] = useState<string[]>(idea?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [editableDueDate, setEditableDueDate] = useState(idea?.dueDate || '');
  const [editableFeedback, setEditableFeedback] = useState(idea?.feedback || '');

  if (!idea) return null;

  const handleSaveChanges = () => {
    const updates: Partial<Idea> = {
      title: editableTitle,
      description: editableDescription,
      benefits: editableBenefits,
      assignee: editableAssignee,
      tags: editableTags,
      dueDate: editableDueDate,
      feedback: editableFeedback,
    };
    onUpdate(idea.id, updates);
    onClose();
  };

  const handleAddTagModal = () => {
    if (newTag.trim() && !editableTags.includes(newTag.trim())) {
      setEditableTags([...editableTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTagModal = (tagToRemove: string) => {
    setEditableTags(editableTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div>
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <input
                type="text"
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                className="text-2xl font-bold text-gray-900 mb-2 w-full border-b-2 border-transparent focus:border-blue-500 outline-none"
                placeholder="Título da Ideia"
              />
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Por: {idea.author?.name}</span>
                <span>Categoria: {idea.category}</span>
                <span>Status: {idea.status}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">📝 Descrição</h4>
                <textarea
                  value={editableDescription}
                  onChange={(e) => setEditableDescription(e.target.value)}
                  className="w-full bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap border border-gray-300 focus:border-blue-500 outline-none"
                  rows={5}
                  placeholder="Detalhes da ideia..."
                />
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">💡 Benefícios Esperados</h4>
                <textarea
                  value={editableBenefits}
                  onChange={(e) => setEditableBenefits(e.target.value)}
                  className="w-full bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap border border-gray-300 focus:border-blue-500 outline-none"
                  rows={5}
                  placeholder="Quais os benefícios esperados..."
                />
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">💬 Comentários ({idea.comments.length})</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {idea.comments.map(comment => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{comment.author?.name}</span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                  {idea.comments.length === 0 && (
                    <p className="text-gray-500 text-center py-4">Nenhum comentário ainda</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">📊 Status</h4>
                <select 
                  value={idea.status}
                  onChange={(e) => updateIdeaStatus(idea.id, e.target.value as IdeaStatus)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value={IdeaStatus.RECEIVED}>Recebida</option>
                  <option value={IdeaStatus.ANALYZING}>Em Análise</option>
                  <option value={IdeaStatus.APPROVED}>Aprovada</option>
                  <option value={IdeaStatus.IN_PROGRESS}>Em Implementação</option>
                  <option value={IdeaStatus.IMPLEMENTED}>Concluída</option>
                  <option value={IdeaStatus.REJECTED}>Rejeitada</option>
                </select>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">👤 Responsável</h4>
                <input
                  type="text"
                  value={editableAssignee}
                  onChange={(e) => setEditableAssignee(e.target.value)}
                  placeholder="Atribuir responsável..."
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">🏷️ Etiquetas</h4>
                <div className="space-y-2">
                  {editableTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {editableTags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {tag}
                          <button onClick={() => handleRemoveTagModal(tag)} className="ml-2 hover:text-blue-600">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Adicionar etiqueta..."
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTagModal();
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">📅 Prazo</h4>
                <input
                  type="date"
                  value={editableDueDate}
                  onChange={(e) => setEditableDueDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">📈 Estatísticas</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Votos</span>
                    <span className="font-medium">{idea.votes}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Comentários</span>
                    <span className="font-medium">{idea.comments.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Criada em</span>
                    <span className="font-medium text-sm">
                      {format(new Date(idea.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">📝 Feedback Administrativo</h4>
                <textarea
                  value={editableFeedback}
                  onChange={(e) => setEditableFeedback(e.target.value)}
                  placeholder="Adicione um feedback para o usuário..."
                  className="w-full p-2 border border-gray-300 rounded-lg resize-none"
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveChanges}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const KanbanBoard: React.FC = () => {
  const { ideas, updateIdeaStatus } = useIdeas();
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [cardData, setCardData] = useState<{
    title: string;
    description: string;
    assignee: string;
    tags: string[];
    dueDate: string;
  }>({
    title: '',
    description: '',
    assignee: '',
    tags: [],
    dueDate: ''
  });

  // Função para atualizar uma ideia completa
  const updateIdea = (ideaId: string, updates: Partial<Idea>) => {
    // Esta função seria implementada no contexto, por ora usamos um mock
    console.log('Atualizando ideia:', ideaId, updates);
  };

  const columns = [
    { status: IdeaStatus.RECEIVED, title: 'Recebidas', color: 'bg-gray-100' },
    { status: IdeaStatus.ANALYZING, title: 'Em Análise', color: 'bg-blue-100' },
    { status: IdeaStatus.APPROVED, title: 'Aprovadas', color: 'bg-green-100' },
    { status: IdeaStatus.IN_PROGRESS, title: 'Em Implementação', color: 'bg-yellow-100' },
    { status: IdeaStatus.IMPLEMENTED, title: 'Concluídas', color: 'bg-purple-100' }
  ];

  const handleDragStart = (e: React.DragEvent, ideaId: string) => {
    e.dataTransfer.setData('ideaId', ideaId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: IdeaStatus) => {
    e.preventDefault();
    const ideaId = e.dataTransfer.getData('ideaId');
    updateIdeaStatus(ideaId, status);
  };

  const getIdeasByStatus = (status: IdeaStatus) => {
    return ideas.filter(idea => idea.status === status);
  };

  const handleEditCard = (idea: Idea) => {
    setEditingCard(idea.id);
    setCardData({
      title: idea.title,
      description: idea.description,
      assignee: idea.assignee || '',
      tags: idea.tags || [],
      dueDate: idea.dueDate || ''
    });
  };

  const handleSaveCard = () => {
    if (editingCard) {
      // Atualizar os dados da ideia
      updateIdea(editingCard, {
        title: cardData.title,
        description: cardData.description,
        assignee: cardData.assignee,
        tags: cardData.tags,
        dueDate: cardData.dueDate
      });
      setEditingCard(null);
    }
  };

  const handleAddTag = (tag: string) => {
    if (tag && !cardData.tags.includes(tag)) {
      setCardData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setCardData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Sistema de Inovação - Painel Administrativo</h2>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <span>Total de ideias: {ideas.length}</span>
          <span>Em análise: {getIdeasByStatus(IdeaStatus.ANALYZING).length}</span>
          <span>Implementadas: {getIdeasByStatus(IdeaStatus.IMPLEMENTED).length}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1200px] grid grid-cols-5 gap-4">
          {columns.map(column => (
            <div
              key={column.status}
              className={`${column.color} rounded-lg p-4 min-h-[500px]`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
            <h3 className="font-semibold text-gray-900 mb-4">{column.title}</h3>
            <div className="space-y-3">
              {getIdeasByStatus(column.status).map(idea => (
                <div
                  key={idea.id}
                  draggable={editingCard !== idea.id}
                  onDragStart={(e) => handleDragStart(e, idea.id)}
                  className="bg-white rounded-lg p-3 shadow cursor-move hover:shadow-md transition-shadow break-words"
                >
                  {editingCard === idea.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={cardData.title}
                        onChange={(e) => setCardData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full font-medium text-sm border-none outline-none bg-transparent"
                        placeholder="Título do cartão"
                      />
                      
                      <textarea
                        value={cardData.description}
                        onChange={(e) => setCardData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full text-xs border-none outline-none bg-gray-50 p-2 rounded resize-none"
                        placeholder="Descrição..."
                        rows={3}
                      />

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <UserPlus className="w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            value={cardData.assignee}
                            onChange={(e) => setCardData(prev => ({ ...prev, assignee: e.target.value }))}
                            className="flex-1 text-xs border border-gray-300 rounded px-2 py-1"
                            placeholder="Responsável"
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <input
                            type="date"
                            value={cardData.dueDate}
                            onChange={(e) => setCardData(prev => ({ ...prev, dueDate: e.target.value }))}
                            className="flex-1 text-xs border border-gray-300 rounded px-2 py-1"
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Tag className="w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            placeholder="Adicionar etiqueta..."
                            className="flex-1 text-xs border border-gray-300 rounded px-2 py-1"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const input = e.target as HTMLInputElement;
                                handleAddTag(input.value);
                                input.value = '';
                              }
                            }}
                          />
                        </div>

                        {cardData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {cardData.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                              >
                                {tag}
                                <button
                                  onClick={() => handleRemoveTag(tag)}
                                  className="ml-1 hover:text-blue-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end space-x-2 pt-2">
                        <button
                          onClick={() => setEditingCard(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleSaveCard}
                          className="text-green-500 hover:text-green-700"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div onClick={() => setSelectedIdea(idea.id)}>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{idea.title}</h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCard(idea);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>

                      {idea.tags && idea.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {idea.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-block px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 truncate max-w-[80px]"
                              title={tag}
                            >
                              {tag}
                            </span>
                          ))}
                          {idea.tags.length > 3 && (
                            <span className="inline-block px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                              +{idea.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {idea.assignee && (
                        <div className="flex items-center space-x-1 mb-2 text-xs text-gray-600">
                          <User className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate" title={idea.assignee}>{idea.assignee}</span>
                        </div>
                      )}

                      {idea.dueDate && (
                        <div className="flex items-center space-x-1 mb-2 text-xs text-gray-600">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">
                            {format(new Date(idea.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1 min-w-0 flex-1">
                          <User className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{idea.author?.name}</span>
                        </div>
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <Calendar className="w-3 h-3" />
                          <span className="text-xs">{format(new Date(idea.createdAt), 'dd/MM', { locale: ptBR })}</span>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-col space-y-1">
                        <div className="flex flex-wrap gap-1 text-xs">
                          <span className="bg-gray-200 px-2 py-1 rounded text-xs whitespace-nowrap">{idea.votes} votos</span>
                          <span className="bg-gray-200 px-2 py-1 rounded text-xs whitespace-nowrap">{idea.comments.length} comentários</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de detalhes da ideia */}
      {selectedIdea && (
        <IdeaDetailModal 
          ideaId={selectedIdea} 
          onClose={() => setSelectedIdea(null)}
          onUpdate={updateIdea} 
        />
      )}
    </div>
  );
};