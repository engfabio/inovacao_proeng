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
        setTimeout(() => {          // Lógica para determinar se precisa de sugestão ou elogio
          const needsSuggestion = Math.random() > 0.6; // 40% chance de sugestão
          
          if (needsSuggestion) {
            const suggestions: { [key: string]: string[] } = {
              title: [
                'Trocar marca do papel higiênico para reduzir custos de manutenção',
                'Sistema de monitoramento de consumo de energia para diminuir gastos',
                'Novo método de organização de tarefas para aumentar produtividade'
              ],
              what: [
                'A ideia é substituir o atual sistema de controle de estoque por um que utilize códigos QR para rastreamento automático de todos os itens. Isso reduziria o tempo de contagem manual e diminuiria erros.',
                'Implementar um sistema de rodízio de funções entre os departamentos, onde cada funcionário passaria um dia por mês em outra área. Isso melhoraria a comunicação entre equipes e o entendimento geral da empresa.',
                'Criar um espaço dedicado para relaxamento e brainstorming, equipado com ferramentas para anotação de ideias. Isso estimularia a criatividade e reduziria o estresse.'
              ],
              who: [
                'O pessoal da TI ficaria responsável pela parte técnica, enquanto os líderes de cada departamento treinariam suas equipes no novo sistema. O pessoal administrativo ajudaria com a documentação.',
                'A equipe de Recursos Humanos coordenaria o projeto, com a participação de um representante de cada departamento. Poderíamos também convidar o pessoal da Qualidade para monitorar os resultados.',
                'O time de manutenção para a instalação, o departamento financeiro para análise de custos, e funcionários que usam os banheiros diariamente para dar feedback direto sobre a qualidade.'
              ],
              why: [
                'Esta mudança é necessária porque atualmente gastamos 15% mais do que o necessário em materiais de escritório. Com o novo sistema, teríamos controle preciso do consumo e poderíamos reduzir desperdícios significativamente.',
                'A implementação é importante pois os funcionários estão expressando insatisfação com o ambiente atual, o que está afetando a produtividade. Pesquisas internas mostram que 67% dos colaboradores sentem falta de mais espaços colaborativos.',
                'Esta mudança resolveria o problema de desperdício que temos enfrentado. Dados mostram que jogamos fora 30% dos materiais por mês devido à má organização. Isso também está alinhado com nossa meta de sustentabilidade.'
              ],
              how: [
                'Começaríamos com um teste piloto no departamento de marketing por um mês. Após ajustes, expandiríamos para outros setores gradualmente. A implementação incluiria: 1) Treinamento inicial, 2) Período de adaptação com suporte intensivo, 3) Avaliação de resultados.',
                'O processo seria dividido em fases: primeiro a pesquisa de fornecedores (2 semanas), seguida pela compra e instalação (1 mês) e finalmente o treinamento dos usuários (2 semanas). Usaríamos metodologia ágil para acompanhar o progresso.',
                'Implementaríamos em três etapas: 1) Substituição gradual dos produtos atuais, começando pelo terceiro andar, 2) Coleta de feedback dos usuários após 15 dias, 3) Ajustes conforme necessário antes de expandir para os demais andares.'
              ],
              description: [
                'Esta ideia consiste em criar um sistema automatizado de controle de temperatura nos ambientes de trabalho, que se ajusta conforme a ocupação e preferências registradas dos funcionários. O sistema utilizaria sensores de presença e um aplicativo simples onde os funcionários poderiam indicar seu conforto térmico. Além de melhorar o bem-estar, reduziríamos o consumo de energia.',
                'A proposta é implementar um programa de reconhecimento entre colegas, onde funcionários podem atribuir "pontos de colaboração" a outros que os ajudaram. Ao final do mês, os mais pontuados receberiam benefícios como folgas ou vales-presente. Isso estimularia o trabalho em equipe e reconheceria contribuições que muitas vezes passam despercebidas pela gestão.',
                'Minha ideia é substituir o papel higiênico atual por um de melhor qualidade mas que rende mais. Embora o custo por unidade seja um pouco maior, cada rolo duraria o dobro, resultando em economia a longo prazo e redução de manutenção. Também melhoraria a experiência dos funcionários e visitantes.'
              ]
            };
            
            const fieldSuggestions = suggestions[fieldName] || [
              'Podemos expandir este campo com exemplos mais específicos para a Proeng. Por exemplo, se for sobre economia, poderia mencionar valores aproximados ou casos anteriores semelhantes que deram certo.',
              'Recomendo incluir informações sobre como esta ideia se alinha com os objetivos atuais da empresa. Por exemplo, se há alguma meta de redução de custos ou melhoria de processos que sua ideia ajudaria a atingir.',
              'Uma sugestão seria adicionar alguns dados concretos para fortalecer sua proposta. Mesmo estimativas aproximadas de economia, tempo poupado ou melhorias de produtividade já ajudariam a convencer os avaliadores.'
            ];

            resolve({
              suggestion: fieldSuggestions[Math.floor(Math.random() * fieldSuggestions.length)]
            });          } else {
            const praises = [
              'Excelente descrição! Sua ideia está muito clara e objetiva. A maneira como você explicou os benefícios é especialmente convincente.',
              'Ótimo trabalho! Esta informação está bem estruturada e fácil de entender. Mesmo alguém sem conhecimento técnico conseguiria compreender sua proposta.',
              'Perfeito! Você incluiu todos os pontos importantes neste campo. Os detalhes fornecidos ajudam a visualizar como a ideia funcionaria na prática.',
              'Muito bom! As informações estão completas e relevantes. A forma como você conectou a ideia com as necessidades da empresa foi excelente.',
              'Parabéns! Seu texto está bem claro e direto. A maneira como você apresentou a ideia demonstra bom conhecimento da empresa e suas necessidades.'
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
    }    // Definir novo timer para análise após 5 segundos
    const newTimer = setTimeout(() => {
      analyzeField(fieldName, value);
    }, 5000); // 5 segundos

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
        <div className="bg-white rounded-lg shadow-md p-6">          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              Nova Ideia de Inovação
            </h1>
            <div className="text-sm text-gray-600 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Análise de IA ativada</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Seção Básica */}
            <div className="border rounded-lg p-6">
              <button
                type="button"
                onClick={() => toggleSection('basic')}
                className="flex items-center justify-between w-full text-left"
              >
                <h2 className="text-lg font-semibold text-gray-800">Sua ideia em poucas palavras</h2>
                {expandedSections.has('basic') ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              {expandedSections.has('basic') && (
                <div className="mt-4 space-y-4">                  {renderFormField('Qual é sua ideia?', 'title', 'Ex: Trocar marca do papel higiênico para economizar', true)}
                  
                  {renderFormField(
                    'Em que área se encaixa?', 
                    'category', 
                    'Escolha a área mais próxima', 
                    true, 
                    'select',
                    categories.map(cat => ({ value: cat, label: cat }))
                  )}
                    {renderFormField('Conte mais sobre sua ideia', 'description', 'Descreva sua ideia com suas próprias palavras, sem termos técnicos...', true, 'textarea')}
                  
                  {renderFormField('Quais benefícios você enxerga?', 'benefits', 'O que melhoraria no dia a dia da Proeng? Ex: Economizaria dinheiro, tempo...', false, 'textarea')}
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
                <h2 className="text-lg font-semibold text-gray-800">Detalhes da sua ideia</h2>
                {expandedSections.has('5w2h') ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              {expandedSections.has('5w2h') && (
                <div className="mt-4 space-y-4">                  {renderFormField('Qual seria sua ideia?', 'what', 'Conte sua ideia de forma simples. Ex: Mudar a marca do papel higiênico porque o atual gasta muito...', false, 'textarea')}
                  {renderFormField('Quem poderia participar?', 'who', 'Quem você acha que deveria ajudar nessa ideia? Ex: Pessoal da limpeza, da TI...', false, 'textarea')}
                  {renderFormField('Quando seria bom implementar?', 'when', 'Tem alguma urgência? Ou pode ser quando der? Ex: Antes do final do ano...', false, 'textarea')}
                  {renderFormField('Onde aplicar essa ideia?', 'where', 'Em qual local, departamento ou sistema? Ex: No banheiro do 3º andar, no sistema de vendas...', false, 'textarea')}
                  {renderFormField('Por que essa ideia é importante?', 'why', 'Qual problema essa ideia resolve? Ex: Reduz custos, evita desperdício...', false, 'textarea')}
                  {renderFormField('Como poderia ser feito?', 'how', 'Se você tiver alguma ideia de como fazer, conte aqui. Não se preocupe se não souber!', false, 'textarea')}
                  {renderFormField('Quanto custaria (mais ou menos)?', 'howMuch', 'Alguma ideia de custo? Pode ser aproximado ou comparação. Ex: Preço de uma impressora nova...', false, 'textarea')}
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
                <h2 className="text-lg font-semibold text-gray-800">Informações adicionais</h2>
                {expandedSections.has('complement') ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              {expandedSections.has('complement') && (
                <div className="mt-4 space-y-4">                  {renderFormField('Alguma dificuldade que você prevê?', 'difficulties', 'Tem algum obstáculo que você imagina? Ex: Talvez algumas pessoas não gostem no início...', false, 'textarea')}
                  {renderFormField('O que seria necessário?', 'resources', 'Precisa de algum material, ferramenta, sistema? Ex: Comprar novo material, contratar serviço...', false, 'textarea')}
                  {renderFormField('Algo importante a considerar?', 'attentionPoints', 'Algum detalhe que precisamos ficar atentos? Ex: Só funciona se todos colaborarem...', false, 'textarea')}
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
      </div>      {/* Painel de IA (versão simplificada) */}
      <div className="lg:col-span-1">
        <div className="sticky top-6">
          {configuration?.isActive ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Dicas para um bom preenchimento
                </h3>
              </div>

              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>Escreva de forma simples e direta, como se estivesse conversando</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>Após 5 segundos sem digitar, a IA analisa o campo automaticamente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>Sugestões aparecem abaixo de cada campo, caso necessário</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>Você pode aplicar ou ignorar as sugestões como preferir</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>Não se preocupe com termos técnicos, escreva como se sente confortável</span>
                    </li>
                  </ul>
                </div>
              </div>
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
