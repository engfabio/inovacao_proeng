import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIdeas } from '../../contexts/IdeasContext';
import { categories } from '../../data/mockData';
import { Lightbulb, AlertCircle } from 'lucide-react';

export const IdeaForm: React.FC = () => {
  const navigate = useNavigate();
  const { submitIdea, ideas } = useIdeas();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    benefits: ''
  });
  const [similarIdeas, setSimilarIdeas] = useState<string[]>([]);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Simular detecção de ideias similares
    if (name === 'title' && value.length > 5) {
      const similar = ideas
        .filter(idea => 
          idea.title.toLowerCase().includes(value.toLowerCase()) ||
          idea.description.toLowerCase().includes(value.toLowerCase())
        )
        .map(idea => idea.title);
      setSimilarIdeas(similar.slice(0, 3));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitIdea(formData);
      navigate('/my-ideas');
    } catch (error) {
      console.error('Erro ao submeter ideia:', error);
    }
  };

  const aiSuggestions = [
    "Tente ser mais específico sobre os benefícios quantitativos",
    "Considere adicionar um prazo estimado para implementação",
    "Mencione os departamentos que serão impactados"
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Enviar Nova Ideia</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="label">
              Título da Ideia
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="input"
              placeholder="Digite um título claro e objetivo"
            />
          </div>

          {similarIdeas.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Ideias similares encontradas:</p>
                  <ul className="mt-2 space-y-1">
                    {similarIdeas.map((idea, index) => (
                      <li key={index} className="text-sm text-yellow-700">• {idea}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="category" className="label">
              Categoria
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="input"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="label">
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="input"
              placeholder="Descreva sua ideia em detalhes"
            />
          </div>

          <div>
            <label htmlFor="benefits" className="label">
              Benefícios Esperados
            </label>
            <textarea
              id="benefits"
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              required
              rows={3}
              className="input"
              placeholder="Quais benefícios esta ideia trará para a empresa?"
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setShowAIAssistant(!showAIAssistant)}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
            >
              <Lightbulb className="w-5 h-5" />
              <span>Assistente IA</span>
            </button>

            <button type="submit" className="btn-primary">
              Enviar Ideia
            </button>
          </div>
        </form>

        {showAIAssistant && (
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-3">Sugestões do Assistente IA:</h3>
            <ul className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-blue-700">•</span>
                  <span className="text-sm text-blue-700">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};