import { User, Idea, IdeaStatus, Badge } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@proeng.com',
    cpf: '123456',
    department: 'TI',
    position: 'Desenvolvedor',
    points: 850,
    level: 2,
    badges: [
      {
        id: 'first-idea',
        name: 'Primeira Ideia',
        description: 'Submeteu sua primeira ideia',
        icon: '💡',
        unlockedAt: new Date('2024-01-15')
      }
    ],
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@proeng.com',
    cpf: '234567',
    department: 'RH',
    position: 'Analista',
    points: 1250,
    level: 3,
    badges: [
      {
        id: 'first-idea',
        name: 'Primeira Ideia',
        description: 'Submeteu sua primeira ideia',
        icon: '💡',
        unlockedAt: new Date('2024-01-10')
      },
      {
        id: 'idea-approved',
        name: 'Ideia Aprovada',
        description: 'Teve uma ideia aprovada',
        icon: '✅',
        unlockedAt: new Date('2024-02-01')
      }
    ],
    createdAt: new Date('2024-01-01')
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@proeng.com',
    cpf: '999999',
    department: 'Inovação',
    position: 'Gestor',
    points: 2500,
    level: 5,
    badges: [],
    createdAt: new Date('2024-01-01')
  }
];

export const mockIdeas: Idea[] = [
  {
    id: '1',
    title: 'Sistema de Gestão de Documentos Digital',
    description: 'Implementar um sistema completo de gestão documental digital para eliminar o uso de papel e melhorar a eficiência dos processos administrativos.',
    category: 'Tecnologia',
    benefits: 'Redução de custos com papel, maior eficiência na busca de documentos, redução do espaço de armazenamento físico.',
    authorId: '1',
    author: mockUsers[0],
    votes: 15,
    voters: ['2', '3'],
    comments: [
      {
        id: '1',
        content: 'Excelente ideia! Isso vai revolucionar nossos processos.',
        authorId: '2',
        author: mockUsers[1],
        ideaId: '1',
        createdAt: new Date('2024-06-02')
      }
    ],
    status: IdeaStatus.ANALYZING,
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-02')
  },
  {
    id: '2',
    title: 'Programa de Mentoria Interna',
    description: 'Criar um programa estruturado de mentoria onde colaboradores experientes possam orientar novos funcionários e compartilhar conhecimentos.',
    category: 'RH',
    benefits: 'Melhor integração de novos funcionários, transferência de conhecimento, desenvolvimento profissional, retenção de talentos.',
    authorId: '2',
    author: mockUsers[1],
    votes: 22,
    voters: ['1', '3'],
    comments: [],
    status: IdeaStatus.APPROVED,
    feedback: 'Ideia aprovada! Iniciaremos um piloto no próximo trimestre.',
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-05-20')
  },
  {
    id: '3',
    title: 'Aplicativo Mobile para Colaboradores',
    description: 'Desenvolver um aplicativo mobile que permita aos colaboradores acessar informações da empresa, solicitar férias, ver contracheques e comunicar-se com o RH.',
    category: 'Tecnologia',
    benefits: 'Maior acessibilidade às informações, redução de processos burocráticos, melhoria na comunicação interna.',
    authorId: '1',
    author: mockUsers[0],
    votes: 18,
    voters: ['2'],
    comments: [],
    status: IdeaStatus.IN_PROGRESS,
    feedback: 'Em desenvolvimento pela equipe de TI.',
    createdAt: new Date('2024-04-10'),
    updatedAt: new Date('2024-06-01')
  }
];

export const departments = [
  'TI',
  'RH',
  'Financeiro',
  'Operações',
  'Marketing',
  'Vendas',
  'Qualidade',
  'Inovação'
];

export const positions = [
  'Analista',
  'Desenvolvedor',
  'Gestor',
  'Coordenador',
  'Supervisor',
  'Assistente',
  'Especialista',
  'Consultor'
];

export const categories = [
  'Tecnologia',
  'Processos',
  'RH',
  'Sustentabilidade',
  'Qualidade',
  'Redução de Custos',
  'Experiência do Cliente',
  'Segurança'
];