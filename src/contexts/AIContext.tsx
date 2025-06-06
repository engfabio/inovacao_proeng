import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AIConfiguration, AIProvider as AIProviderType, AIContextType, AIResponse, IdeaFormData } from '../types';

const AIContext = createContext<AIContextType | undefined>(undefined);

// Provedores de IA conhecidos
const DEFAULT_PROVIDERS: AIProviderType[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        description: 'Modelo mais avançado da OpenAI com capacidades multimodais',
        maxTokens: 128000,
        costPer1kTokens: 0.005
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        description: 'Versão mais rápida e econômica do GPT-4o',
        maxTokens: 128000,
        costPer1kTokens: 0.0015
      },
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        description: 'Modelo GPT-4 otimizado para velocidade',
        maxTokens: 128000,
        costPer1kTokens: 0.01
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: 'Modelo econômico e eficiente',
        maxTokens: 16384,
        costPer1kTokens: 0.001
      }
    ],
    requiresApiKey: true,
    baseUrl: 'https://api.openai.com/v1'
  },
  {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    models: [
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        description: 'Modelo mais avançado da Anthropic',
        maxTokens: 200000,
        costPer1kTokens: 0.003
      },
      {
        id: 'claude-3-haiku-20240307',
        name: 'Claude 3 Haiku',
        description: 'Modelo rápido e econômico',
        maxTokens: 200000,
        costPer1kTokens: 0.00025
      }
    ],
    requiresApiKey: true,
    baseUrl: 'https://api.anthropic.com/v1'
  },
  {
    id: 'google',
    name: 'Google (Gemini)',
    models: [
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        description: 'Modelo avançado do Google com grande contexto',
        maxTokens: 2000000,
        costPer1kTokens: 0.0025
      },
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        description: 'Modelo rápido e eficiente',
        maxTokens: 1000000,
        costPer1kTokens: 0.000375
      }
    ],
    requiresApiKey: true,
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta'
  },
  {
    id: 'ollama',
    name: 'Ollama (Local)',
    models: [
      {
        id: 'llama3.2',
        name: 'Llama 3.2',
        description: 'Modelo local da Meta',
        maxTokens: 131072,
        costPer1kTokens: 0
      },
      {
        id: 'mistral',
        name: 'Mistral 7B',
        description: 'Modelo local eficiente',
        maxTokens: 32768,
        costPer1kTokens: 0
      },
      {
        id: 'codellama',
        name: 'Code Llama',
        description: 'Especializado em código',
        maxTokens: 100000,
        costPer1kTokens: 0
      }
    ],
    requiresApiKey: false,
    baseUrl: 'http://localhost:11434/api'
  }
];

// Prompt padrão para análise de ideias
export const DEFAULT_PROMPT = `Você é um consultor especializado em inovação empresarial trabalhando EXCLUSIVAMENTE para a PROENG - uma empresa brasileira focada em soluções de engenharia e desenvolvimento de projetos.

CONTEXTO DA PROENG:
- Empresa brasileira do setor de engenharia e consultoria
- Foco em inovação, desenvolvimento de projetos e soluções técnicas
- Departamento de Inovação ativo buscando melhorias operacionais
- Cultura de colaboração e participação dos funcionários
- Interesse em otimização de processos, tecnologia e eficiência

RESTRIÇÕES IMPORTANTES:
- Você DEVE trabalhar APENAS com ideias relacionadas ao ambiente empresarial da Proeng
- NÃO responda sobre: receitas, culinária, entretenimento, vida pessoal ou assuntos não empresariais
- Se uma ideia não for relacionada ao contexto empresarial, responda educadamente que só pode auxiliar com ideias de inovação empresarial para a Proeng

METODOLOGIA 5W2H PARA ANÁLISE:
Analise a ideia empresarial fornecida e melhore cada campo seguindo a metodologia 5W2H:

1. **O QUÊ?** (What): Descreva claramente o projeto/ideia de inovação empresarial
2. **QUEM?** (Who): Identifique responsáveis, departamentos da Proeng, colaboradores envolvidos
3. **QUANDO?** (When): Defina cronograma, prazos e marcos do projeto
4. **ONDE?** (Where): Especifique locais, setores da Proeng, áreas de implementação
5. **POR QUÊ?** (Why): Justifique a importância para a Proeng, benefícios operacionais e estratégicos
6. **COMO?** (How): Detalhe metodologia de implementação específica para a Proeng
7. **QUANTO CUSTARÁ?** (How much): Estime investimentos, recursos e retorno para a Proeng

CAMPOS ADICIONAIS:
- **Dificuldades**: Identifique obstáculos específicos no contexto da Proeng
- **Recursos Necessários**: Liste recursos humanos, tecnológicos e financeiros da Proeng
- **Pontos de Atenção**: Destaque riscos e considerações para a operação da Proeng

DIRETRIZES PARA SUGESTÕES:
- Foque em melhorias operacionais, tecnológicas e de processos
- Considere o ambiente de engenharia e consultoria da Proeng
- Sugira soluções práticas e implementáveis
- Priorize eficiência, qualidade e inovação tecnológica
- Considere aspectos de sustentabilidade e responsabilidade empresarial
- Pense em diferenciação competitiva no mercado de engenharia

FORMATO DE RESPOSTA:
Responda SEMPRE em JSON no formato:
{
  "isBusinessRelevant": true/false,
  "suggestions": {
    "title": "título melhorado focado na Proeng",
    "category": "categoria empresarial sugerida",
    "what": "o que melhorado para contexto empresarial",
    "who": "quem na Proeng (departamentos, funções)",
    "when": "cronograma específico para implementação na Proeng",
    "where": "onde na Proeng (setores, locais, sistemas)",
    "why": "justificativa com benefícios para a Proeng",
    "how": "metodologia de implementação na Proeng",
    "howMuch": "estimativa de custos e ROI para a Proeng",
    "difficulties": "desafios específicos no contexto da Proeng",
    "resources": "recursos da Proeng necessários",
    "attentionPoints": "pontos de atenção operacionais da Proeng",
    "description": "descrição consolidada focada na Proeng",
    "benefits": "benefícios específicos para a operação da Proeng"
  },
  "improvements": ["melhoria empresarial 1", "melhoria empresarial 2"],
  "relatedIdeas": ["ideia empresarial relacionada 1", "ideia empresarial relacionada 2"],
  "businessContext": "Análise de como a ideia se alinha com os objetivos da Proeng"
}

Se a ideia NÃO for empresarial ou relevante para a Proeng, responda:
{
  "isBusinessRelevant": false,
  "error": "Esta ideia não se relaciona ao contexto empresarial da Proeng. Por favor, submeta ideias de inovação empresarial, melhorias operacionais, tecnológicas ou de processos relacionadas às atividades da empresa.",
  "suggestions": {},
  "improvements": [],
  "relatedIdeas": []
}

Ideia para análise:`;

interface AIProviderProps {
  children: ReactNode;
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const [configuration, setConfiguration] = useState<AIConfiguration | null>(null);
  const [providers, setProviders] = useState<AIProviderType[]>(DEFAULT_PROVIDERS);
  const [isProcessing, setIsProcessing] = useState(false);
  useEffect(() => {
    // Carregar configuração salva do localStorage
    const savedConfig = localStorage.getItem('ai_configuration');
    if (savedConfig) {
      try {
        setConfiguration(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Erro ao carregar configuração de IA:', error);
        // Se houver erro, criar configuração padrão
        createDefaultConfiguration();
      }
    } else {
      // Se não há configuração salva, criar uma padrão
      createDefaultConfiguration();
    }
  }, []);

  const createDefaultConfiguration = () => {
    const defaultConfig: AIConfiguration = {
      id: 'default',
      providerId: 'openai',
      modelId: 'gpt-4o-mini',
      apiKey: '',
      prompt: DEFAULT_PROMPT,
      maxTokens: 4000,
      temperature: 0.7,
      isActive: false, // Inativo até que seja configurado
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setConfiguration(defaultConfig);
    localStorage.setItem('ai_configuration', JSON.stringify(defaultConfig));
  };
  const updateConfiguration = async (config: Partial<AIConfiguration>): Promise<void> => {
    const updatedConfig: AIConfiguration = {
      id: configuration?.id || 'default',
      providerId: config.providerId || configuration?.providerId || '',
      modelId: config.modelId || configuration?.modelId || '',
      apiKey: config.apiKey || configuration?.apiKey || '',
      prompt: config.prompt || configuration?.prompt || DEFAULT_PROMPT,
      maxTokens: config.maxTokens || configuration?.maxTokens || 4000,
      temperature: config.temperature !== undefined ? config.temperature : (configuration?.temperature ?? 0.7),
      isActive: config.isActive !== undefined ? config.isActive : (configuration?.isActive ?? true),
      createdAt: configuration?.createdAt || new Date(),
      updatedAt: new Date(),
      ...config
    };

    setConfiguration(updatedConfig);
    localStorage.setItem('ai_configuration', JSON.stringify(updatedConfig));
  };

  const refreshModels = async (providerId: string): Promise<void> => {
    try {
      // Simular atualização de modelos (em uma implementação real, faria uma chamada à API)
      console.log(`Atualizando modelos para o provedor: ${providerId}`);
      
      // Aqui você poderia fazer uma chamada real para obter os modelos mais recentes
      // Por exemplo, para OpenAI: GET https://api.openai.com/v1/models
      
      // Por enquanto, apenas simular a atualização
      setProviders(prev => prev.map(provider => {
        if (provider.id === providerId) {
          return {
            ...provider,
            models: [...provider.models] // Simular que os modelos foram atualizados
          };
        }
        return provider;
      }));
      
    } catch (error) {
      console.error('Erro ao atualizar modelos:', error);
      throw error;
    }
  };

  const analyzeIdea = async (ideaData: Partial<IdeaFormData>): Promise<AIResponse> => {
    if (!configuration || !configuration.isActive) {
      return {
        success: false,
        suggestions: {},
        improvements: [],
        relatedIdeas: [],
        error: 'Configuração de IA não encontrada ou inativa'
      };
    }

    setIsProcessing(true);

    try {
      // Montar o prompt com os dados da ideia
      const ideaText = `
TÍTULO: ${ideaData.title || 'Não informado'}
CATEGORIA: ${ideaData.category || 'Não informada'}

O QUÊ: ${ideaData.what || 'Não informado'}
QUEM: ${ideaData.who || 'Não informado'}
QUANDO: ${ideaData.when || 'Não informado'}
ONDE: ${ideaData.where || 'Não informado'}
POR QUÊ: ${ideaData.why || 'Não informado'}
COMO: ${ideaData.how || 'Não informado'}
QUANTO CUSTARÁ: ${ideaData.howMuch || 'Não informado'}
DIFICULDADES: ${ideaData.difficulties || 'Não informado'}
RECURSOS NECESSÁRIOS: ${ideaData.resources || 'Não informado'}
PONTOS DE ATENÇÃO: ${ideaData.attentionPoints || 'Não informado'}
      `.trim();

      const fullPrompt = `${configuration.prompt}\n\n${ideaText}`;

      // Simular chamada à API da IA (substituir por implementação real)
      const response = await simulateAICall(fullPrompt, configuration);
      
      return response;

    } catch (error) {
      console.error('Erro ao analisar ideia com IA:', error);
      return {
        success: false,
        suggestions: {},
        improvements: [],
        relatedIdeas: [],
        error: `Erro na análise: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const contextValue: AIContextType = {
    configuration,
    providers,
    updateConfiguration,
    refreshModels,
    analyzeIdea,
    isProcessing
  };

  return (
    <AIContext.Provider value={contextValue}>
      {children}
    </AIContext.Provider>
  );
};

// Função para simular chamada à IA (substituir por implementação real)
const simulateAICall = async (prompt: string, config: AIConfiguration): Promise<AIResponse> => {
  // Simular delay da API
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Resposta simulada (em produção, fazer chamada real para a API)
  return {
    success: true,
    suggestions: {
      title: "Centro de Excelência em Capacitação e Aperfeiçoamento Proeng (CECAP)",
      category: "Capacitação e Desenvolvimento",
      what: "Estabelecer um departamento interno especializado em capacitação e aperfeiçoamento técnico, denominado CECAP, focado inicialmente em colaboradores internos e posteriormente expandido para o mercado externo, posicionando a Proeng como referência em treinamentos de segurança do trabalho.",
      who: "Empresa: Proeng | Centro de Custo: Departamento CECAP (novo) | Responsáveis: Equipe de RH e Segurança do Trabalho | Tipo de Negócio: Prestação de serviços de treinamento e capacitação",
      when: "Implementação em 3 fases: Fase 1 (Meses 1-2): Planejamento e estruturação | Fase 2 (Meses 3-4): Desenvolvimento de conteúdo e infraestrutura | Fase 3 (Meses 5-6): Lançamento piloto interno",
      where: "Instalações da Proeng com adaptação de espaços para salas de treinamento | Centro de Custo: CECAP | Expansão futura para atendimento externo nas mesmas instalações",
      why: "Otimizar processos internos de capacitação, reduzir custos com treinamentos externos, melhorar a qualificação dos colaboradores, gerar nova fonte de receita e estabelecer a Proeng como referência em segurança do trabalho no mercado.",
      how: "Através de metodologia estruturada incluindo: levantamento de necessidades, desenvolvimento de conteúdo programático, aquisição de equipamentos e materiais didáticos, certificação de instrutores, criação de plataforma digital de apoio e implementação de sistema de avaliação.",
      howMuch: "Investimento inicial: R$ 50.000,00 | ROI esperado: 6-8 meses para cobertura do investimento | Receita projetada: A partir do 9º mês | Margem estimada: 60-70% após estabilização",
      difficulties: "Necessidade de aprovação da diretoria, adaptação de espaços físicos, certificação junto aos órgãos competentes, concorrência com centros estabelecidos, captação inicial de clientes externos e manutenção da qualidade dos serviços.",
      resources: "Recursos Financeiros: R$ 50.000,00 iniciais | Recursos Humanos: 2-3 instrutores qualificados, 1 coordenador administrativo | Recursos Materiais: Equipamentos de segurança, material didático, sistema de gestão de treinamentos, infraestrutura física adequada",
      attentionPoints: "Conformidade regulatória com NRs e órgãos certificadores, manutenção da qualidade para preservar a reputação da Proeng, gestão de agenda para não conflitar com atividades principais, atualização constante de conteúdos conforme mudanças normativas.",
      description: "O projeto CECAP visa criar um centro de excelência interno para capacitação em segurança do trabalho, otimizando recursos e posicionando a Proeng como referência no mercado através de treinamentos de alta qualidade.",
      benefits: "Redução de custos com treinamentos externos, melhoria na qualificação dos colaboradores, nova fonte de receita, fortalecimento da marca Proeng no mercado de segurança do trabalho e otimização de processos internos."
    },
    improvements: [
      "Considere incluir parcerias com universidades para certificação acadêmica",
      "Avalie a criação de uma plataforma EAD para ampliar o alcance",
      "Implemente sistema de feedback contínuo dos participantes",
      "Considere certificação ISO para o centro de treinamento"
    ],
    relatedIdeas: [
      "Sistema de gestão de competências internas",
      "Plataforma digital de treinamentos",
      "Programa de mentoria interna",
      "Centro de simulação de acidentes"
    ]
  };
};

export const useAI = (): AIContextType => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
