import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIdeas } from '../../contexts/IdeasContext';
import { useAI } from '../../contexts/AIContext';
import { categories } from '../../data/mockData';
import { IdeaFormData } from '../../types';
import { 
  Lightbulb, 
  AlertCircle, 
  Sparkles, 
  Loader2, 
  ChevronDown, 
  ChevronUp,
  Save,
  Send,
  RefreshCw
} from 'lucide-react';

export const EnhancedIdeaForm: React.FC = () => {
  const navigate = useNavigate();
  const { submitIdea, ideas } = useIdeas();
  const { analyzeIdea, configuration } = useAI();
  
  const [formData, setFormData] = useState<Partial<IdeaFormData>>({
    title: '',
    category: '',
    what: '',
    who: '',
    when: '',
    where: '',
    why: '',
    how: '',
    howMuch: '',
    difficulties: '',
    resources: '',
    attentionPoints: '',
    description: '',
    benefits: ''
  });

  const [similarIdeas, setSimilarIdeas] = useState<string[]>([]);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic']));
  const [isGeneralAnalyzing, setIsGeneralAnalyzing] = useState(false);
  const [lastAnalyzedData, setLastAnalyzedData] = useState<string>('');

  // Estados para análise campo a campo
  const [fieldSuggestions, setFieldSuggestions] = useState<Record<string, any>>({});
  const [fieldTimers, setFieldTimers] = useState<Record<string, NodeJS.Timeout>>({});
  const [analyzingFields, setAnalyzingFields] = useState<Set<string>>(new Set());
  const [fieldStatus, setFieldStatus] = useState<Record<string, 'analyzing' | 'suggestion' | 'approved' | 'praised'>>({});

  // Função para analisar um campo específico
  const analyzeField = useCallback(async (fieldName: string, value: string) => {
    if (!configuration?.isActive || !value.trim() || value.length < 10) {
      return;
    }

    setAnalyzingFields(prev => new Set(Array.from(prev).concat(fieldName)));
    setFieldStatus(prev => ({ ...prev, [fieldName]: 'analyzing' }));

    try {
      // Simular análise de IA (aqui você integraria com a API real)
      const mockAnalysis = await new Promise<{suggestion?: string, praise?: string}>((resolve) => {
        setTimeout(() => {
          // Lógica para determinar se precisa de sugestão ou elogio
          const needsSuggestion = Math.random() > 0.6; // 40% chance de sugestão
          
          if (needsSuggestion) {
            const suggestions: { [key: string]: string[] } = {
              title: [
                'Considere um título mais específico que destaque o valor da inovação',
                'Adicione palavras-chave que facilitem a busca e compreensão',
                'Torne o título mais atrativo para stakeholders'
              ],
              what: [
                'Detalhe melhor os componentes técnicos da solução',
                'Inclua métricas específicas de resultados esperados',
                'Descreva com mais clareza o diferencial inovador'
              ],
              who: [
                'Especifique os perfis profissionais necessários',
                'Identifique stakeholders chave e suas responsabilidades',
                'Considere parceiros externos que podem contribuir'
              ],
              why: [
                'Adicione dados quantitativos que justifiquem a necessidade',
                'Relacione com objetivos estratégicos da Proeng',
                'Inclua análise de impacto no mercado ou clientes'
              ],
              how: [
                'Detalhe as etapas de implementação de forma mais clara',
                'Considere metodologias ágeis ou frameworks específicos',
                'Inclua marcos de controle e validação'
              ],
              description: [
                'Conecte melhor os aspectos técnicos com benefícios de negócio',
                'Adicione exemplos práticos de aplicação',
                'Simplifique a linguagem para diferentes públicos'
              ]
            };

            const fieldSuggestions = suggestions[fieldName] || [
              `Considere expandir este campo com mais detalhes específicos da Proeng`,
              `Adicione informações que conectem com os objetivos estratégicos da empresa`,
              `Inclua dados ou métricas que suportem sua proposta`
            ];

            resolve({
              suggestion: fieldSuggestions[Math.floor(Math.random() * fieldSuggestions.length)]
            });
          } else {
            const praises = [
              'Excelente descrição! Muito clara e objetiva.',
              'Ótimo trabalho! Esta informação está bem estruturada.',
              'Perfeito! Este campo está muito bem detalhado.',
              'Muito bom! Informação completa e relevante.',
              'Excelente! Este conteúdo atende aos critérios da Proeng.'
            ];
            
            resolve({
              praise: praises[Math.floor(Math.random() * praises.length)]
            });
          }
        }, 1500); // Simular tempo de processamento
      });

      setFieldSuggestions(prev => ({
        ...prev,
        [fieldName]: mockAnalysis
      }));

      setFieldStatus(prev => ({
        ...prev,
        [fieldName]: mockAnalysis.suggestion ? 'suggestion' : 'praised'
      }));

    } catch (error) {
      console.error('Erro na análise do campo:', error);
    } finally {
      setAnalyzingFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(fieldName);
        return newSet;
      });
    }
  }, [configuration]);

  // Função para aplicar sugestão de campo
  const applyFieldSuggestion = (fieldName: string, suggestion: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: suggestion }));
    setFieldStatus(prev => ({ ...prev, [fieldName]: 'approved' }));
    // Limpar a sugestão após aplicar
    setFieldSuggestions(prev => {
      const newSuggestions = { ...prev };
      delete newSuggestions[fieldName];
      return newSuggestions;
    });
  };

  // Função para dispensar sugestão
  const dismissFieldSuggestion = (fieldName: string) => {
    setFieldStatus(prev => ({ ...prev, [fieldName]: 'approved' }));
    setFieldSuggestions(prev => {
      const newSuggestions = { ...prev };
      delete newSuggestions[fieldName];
      return newSuggestions;
    });
  };

  // Função para renderizar feedback do campo
  const renderFieldFeedback = (fieldName: string) => {
    const isFieldAnalyzing = analyzingFields.has(fieldName);
    const suggestion = fieldSuggestions[fieldName];

    if (isFieldAnalyzing) {
      return (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-700">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">Analisando com IA...</span>
          </div>
        </div>
      );
    }

    if (suggestion?.suggestion) {
      return (
        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Sugestão da IA</span>
              </div>
              <p className="text-sm text-yellow-700">{suggestion.suggestion}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => applyFieldSuggestion(fieldName, suggestion.suggestion)}
              className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
            >
              Aplicar
            </button>
            <button
              type="button"
              onClick={() => dismissFieldSuggestion(fieldName)}
              className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
            >
              Dispensar
            </button>
          </div>
        </div>
      );
    }

    if (suggestion?.praise) {
      return (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-700">
            <Sparkles className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium">IA aprova:</span>
            <span className="text-sm">{suggestion.praise}</span>
          </div>
        </div>
      );
    }

    return null;
  };

  // Debounce para análise de campo
  const handleFieldChange = useCallback((fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));

    // Limpar timer anterior se existir
    if (fieldTimers[fieldName]) {
      clearTimeout(fieldTimers[fieldName]);
    }

    // Limpar sugestões anteriores quando o usuário começar a digitar
    if (fieldSuggestions[fieldName]) {
      setFieldSuggestions(prev => {
        const newSuggestions = { ...prev };
        delete newSuggestions[fieldName];
        return newSuggestions;
      });
      setFieldStatus(prev => {
        const newStatus = { ...prev };
        delete newStatus[fieldName];
        return newStatus;
      });
    }

    // Definir novo timer para análise após 10 segundos
    const newTimer = setTimeout(() => {
      analyzeField(fieldName, value);
    }, 10000); // 10 segundos

    setFieldTimers(prev => ({
      ...prev,
      [fieldName]: newTimer
    }));
  }, [fieldTimers, fieldSuggestions, analyzeField]);

  // Cleanup dos timers
  useEffect(() => {
    return () => {
      Object.values(fieldTimers).forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, [fieldTimers]);

  // Verificar ideias similares
  useEffect(() => {
    if (formData.title && formData.title.length > 3) {
      const similar = ideas.filter(idea => 
        idea.title.toLowerCase().includes(formData.title!.toLowerCase()) ||
        formData.title!.toLowerCase().includes(idea.title.toLowerCase())
      ).map(idea => idea.title);
      setSimilarIdeas(similar);
    } else {
      setSimilarIdeas([]);
    }
  }, [formData.title, ideas]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const handleAnalyzeWithAI = async () => {
    if (!configuration?.isActive) return;

    const currentData = JSON.stringify(formData);
    if (currentData === lastAnalyzedData) return;

    setIsGeneralAnalyzing(true);
    setShowAIPanel(true);
    
    try {
      const analysis = await analyzeIdea(formData);
      setAiSuggestions(analysis);
      setLastAnalyzedData(currentData);
    } catch (error) {
      console.error('Erro na análise:', error);
    } finally {
      setIsGeneralAnalyzing(false);
    }
  };

  const applySuggestion = (field: keyof IdeaFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.description) {
      alert('Preencha os campos obrigatórios: Título, Categoria e Descrição');
      return;
    }

    try {
      await submitIdea(formData as IdeaFormData);
      navigate('/my-ideas');
    } catch (error) {
      console.error('Erro ao submeter ideia:', error);
      alert('Erro ao submeter ideia. Tente novamente.');
    }
  };

  const renderFormField = (
    label: string,
    fieldName: keyof IdeaFormData,
    placeholder: string,
    required: boolean = false,
    type: 'input' | 'textarea' | 'select' = 'input',
    options?: Array<{value: string, label: string}>
  ) => {
    const value = formData[fieldName] || '';
    
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        {type === 'select' ? (
          <select
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={required}
          >
            <option value="">{placeholder}</option>
            {options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            placeholder={placeholder}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            required={required}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            placeholder={placeholder}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={required}
          />
        )}
        
        {renderFieldFeedback(fieldName)}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Formulário principal */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              Nova Ideia de Inovação
            </h1>
            {configuration?.isActive && (
              <button
                onClick={handleAnalyzeWithAI}
                disabled={isGeneralAnalyzing}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGeneralAnalyzing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {isGeneralAnalyzing ? 'Analisando...' : 'Analisar com IA'}
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Seção Básica */}
            <div className="border rounded-lg p-6">
              <button
                type="button"
                onClick={() => toggleSection('basic')}
                className="flex items-center justify-between w-full text-left"
              >
                <h2 className="text-lg font-semibold text-gray-800">Informações Básicas</h2>
                {expandedSections.has('basic') ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              {expandedSections.has('basic') && (
                <div className="mt-4 space-y-4">
                  {renderFormField('Título da Ideia', 'title', 'Ex: Sistema de gestão inteligente de recursos', true)}
                  
                  {renderFormField(
                    'Categoria', 
                    'category', 
                    'Selecione uma categoria', 
                    true, 
                    'select',
                    categories.map(cat => ({ value: cat, label: cat }))
                  )}
                  
                  {renderFormField('Descrição Geral', 'description', 'Descreva sua ideia de forma clara e objetiva...', true, 'textarea')}
                  
                  {renderFormField('Benefícios Esperados', 'benefits', 'Quais benefícios esta ideia trará para a Proeng?', false, 'textarea')}
                </div>
              )}
            </div>

            {/* Seção 5W2H */}
            <div className="border rounded-lg p-6">
              <button
                type="button"
                onClick={() => toggleSection('5w2h')}
                className="flex items-center justify-between w-full text-left"
              >
                <h2 className="text-lg font-semibold text-gray-800">Metodologia 5W2H</h2>
                {expandedSections.has('5w2h') ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              {expandedSections.has('5w2h') && (
                <div className="mt-4 space-y-4">
                  {renderFormField('O quê? (What)', 'what', 'O que exatamente é a inovação proposta?', false, 'textarea')}
                  {renderFormField('Quem? (Who)', 'who', 'Quem estará envolvido na implementação?', false, 'textarea')}
                  {renderFormField('Quando? (When)', 'when', 'Qual o prazo estimado para implementação?', false, 'textarea')}
                  {renderFormField('Onde? (Where)', 'where', 'Onde será implementada a inovação?', false, 'textarea')}
                  {renderFormField('Por quê? (Why)', 'why', 'Por que esta inovação é necessária?', false, 'textarea')}
                  {renderFormField('Como? (How)', 'how', 'Como será implementada a inovação?', false, 'textarea')}
                  {renderFormField('Quanto? (How Much)', 'howMuch', 'Qual o investimento estimado?', false, 'textarea')}
                </div>
              )}
            </div>

            {/* Seção Complementar */}
            <div className="border rounded-lg p-6">
              <button
                type="button"
                onClick={() => toggleSection('complement')}
                className="flex items-center justify-between w-full text-left"
              >
                <h2 className="text-lg font-semibold text-gray-800">Informações Complementares</h2>
                {expandedSections.has('complement') ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              {expandedSections.has('complement') && (
                <div className="mt-4 space-y-4">
                  {renderFormField('Dificuldades Esperadas', 'difficulties', 'Quais obstáculos podem surgir?', false, 'textarea')}
                  {renderFormField('Recursos Necessários', 'resources', 'Que recursos serão necessários?', false, 'textarea')}
                  {renderFormField('Pontos de Atenção', 'attentionPoints', 'O que merece atenção especial?', false, 'textarea')}
                </div>
              )}
            </div>

            {/* Alertas */}
            {similarIdeas.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-800">Ideias Similares Encontradas</h3>
                    <ul className="mt-1 text-sm text-yellow-700">
                      {similarIdeas.slice(0, 3).map((idea, index) => (
                        <li key={index}>• {idea}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Botões de ação */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                Submeter Ideia
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Painel de IA */}
      <div className="lg:col-span-1">
        <div className="sticky top-6">
          {configuration?.isActive ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Assistente de IA
                </h3>
                <button
                  onClick={() => setShowAIPanel(!showAIPanel)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showAIPanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {showAIPanel && (
                <div className="space-y-4">
                  {isGeneralAnalyzing ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-3" />
                      <p className="text-sm text-gray-600">Analisando sua ideia...</p>
                    </div>
                  ) : aiSuggestions ? (
                    <div className="space-y-4">
                      {/* Sugestões de melhoria */}
                      {Object.entries(aiSuggestions.suggestions || {}).map(([field, value]) => {
                        if (!value || typeof value !== 'string') return null;
                        return (
                          <div key={field} className="border border-blue-200 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-blue-800 capitalize">
                                {field === 'what' ? 'O quê' : 
                                 field === 'who' ? 'Quem' :
                                 field === 'when' ? 'Quando' :
                                 field === 'where' ? 'Onde' :
                                 field === 'why' ? 'Por quê' :
                                 field === 'how' ? 'Como' :
                                 field === 'howMuch' ? 'Quanto' :
                                 field}
                              </span>
                              <button
                                onClick={() => applySuggestion(field as keyof IdeaFormData, value as string)}
                                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                              >
                                Aplicar
                              </button>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-3">{value as string}</p>
                          </div>
                        );
                      })}

                      {/* Melhorias sugeridas */}
                      {aiSuggestions.improvements && aiSuggestions.improvements.length > 0 && (
                        <div className="border-t pt-4">
                          <h4 className="font-medium text-gray-900 mb-2">Melhorias Sugeridas:</h4>
                          <ul className="space-y-1">
                            {aiSuggestions.improvements.map((improvement: string, index: number) => (
                              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Ideias relacionadas */}
                      {aiSuggestions.relatedIdeas && aiSuggestions.relatedIdeas.length > 0 && (
                        <div className="border-t pt-4">
                          <h4 className="font-medium text-gray-900 mb-2">Ideias Relacionadas:</h4>
                          <ul className="space-y-1">
                            {aiSuggestions.relatedIdeas.map((idea: string, index: number) => (
                              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                                <span className="text-purple-500 mt-1">•</span>
                                <span>{idea}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Clique em "Analisar com IA" para obter sugestões</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">IA Indisponível</h3>
              <p className="text-sm text-gray-500">
                A assistência de IA não está configurada. Entre em contato com o administrador.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedIdeaForm;
