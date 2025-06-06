export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  department: string;
  position: string;
  points: number;
  level: number;
  badges: Badge[];
  createdAt: Date;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  benefits: string;
  authorId: string;
  author?: User;
  votes: number;
  voters: string[];
  comments: Comment[];
  status: IdeaStatus;
  feedback?: string;
  assignee?: string;
  tags?: string[];
  dueDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author?: User;
  ideaId: string;
  createdAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export enum IdeaStatus {
  RECEIVED = 'received',
  ANALYZING = 'analyzing',
  APPROVED = 'approved',
  IN_PROGRESS = 'in_progress',
  IMPLEMENTED = 'implemented',
  REJECTED = 'rejected'
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, cpf: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
}

export interface RegisterData {
  name: string;
  email: string;
  cpf: string;
  department: string;
  position: string;
  password: string;
}

export interface IdeasContextType {
  ideas: Idea[];
  submitIdea: (ideaData: Omit<Idea, 'id' | 'authorId' | 'votes' | 'voters' | 'comments' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  voteIdea: (ideaId: string) => Promise<void>;
  addComment: (ideaId: string, content: string) => Promise<void>;
  updateIdeaStatus: (ideaId: string, status: IdeaStatus, feedback?: string) => Promise<void>;
  getMyIdeas: () => Idea[];
  getTopIdeas: () => Idea[];
}

export interface GamificationContextType {
  userPoints: number;
  userLevel: number;
  userBadges: Badge[];
  ranking: User[];
  addPoints: (points: number) => void;
  checkAndUnlockBadges: () => void;
}

// Interfaces para configuração de IA
export interface AIProvider {
  id: string;
  name: string;
  models: AIModel[];
  requiresApiKey: boolean;
  baseUrl?: string;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
  costPer1kTokens?: number;
}

export interface AIConfiguration {
  id: string;
  providerId: string;
  modelId: string;
  apiKey: string;
  prompt: string;
  maxTokens: number;
  temperature: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface melhorada para ideias com campos estruturados
export interface IdeaFormData {
  // Campos básicos
  title: string;
  category: string;
  
  // Os 5W2H estruturados
  what: string;           // O quê?
  who: string;            // Quem? Qual Empresa? Centro de Custo? Tipo de Negócio?
  when: string;           // Quando?
  where: string;          // Onde? Qual Empresa? Centro de Custo? Tipo de Negócio?
  why: string;            // Por quê?
  how: string;            // Como?
  howMuch: string;        // Quanto custará?
  
  // Campos adicionais
  difficulties: string;    // Quais as dificuldades?
  resources: string;       // Recursos Necessários?
  attentionPoints: string; // Ponto de Atenção?
  
  // Campo consolidado para compatibilidade
  description: string;     // Será gerado automaticamente pela IA
  benefits: string;        // Será extraído do "Por quê?" pela IA
}

// Interface para resposta da IA
export interface AIResponse {
  success: boolean;
  suggestions: {
    title?: string;
    category?: string;
    what?: string;
    who?: string;
    when?: string;
    where?: string;
    why?: string;
    how?: string;
    howMuch?: string;
    difficulties?: string;
    resources?: string;
    attentionPoints?: string;
    description?: string;
    benefits?: string;
  };
  improvements: string[];
  relatedIdeas: string[];
  error?: string;
}

// Interface para contexto de IA
export interface AIContextType {
  configuration: AIConfiguration | null;
  providers: AIProvider[];
  updateConfiguration: (config: Partial<AIConfiguration>) => Promise<void>;
  refreshModels: (providerId: string) => Promise<void>;
  analyzeIdea: (ideaData: Partial<IdeaFormData>) => Promise<AIResponse>;
  isProcessing: boolean;
}