import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lightbulb } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    cpf: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(formData.email, formData.cpf);
      navigate('/');
    } catch (err) {
      setError('Email ou CPF inválidos');
    }
  };

  // Credenciais de demonstração
  const demoCredentials = [
    { email: 'joao.silva@proeng.com', cpf: '123456' },
    { email: 'maria.santos@proeng.com', cpf: '234567' },
    { email: 'admin@proeng.com', cpf: '999999' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <Lightbulb className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Inovação Corporativa</h1>
          <p className="text-gray-600 mt-2">Gamificação</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="label">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input"
              placeholder="seu.email@proeng.com"
            />
          </div>

          <div>
            <label htmlFor="cpf" className="label">
              CPF (6 primeiros dígitos)
            </label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              required
              maxLength={6}
              pattern="[0-9]{6}"
              className="input"
              placeholder="123456"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button type="submit" className="w-full btn-primary">
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/register" className="text-primary-600 hover:text-primary-700 text-sm">
            Não tem uma conta? Cadastre-se
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-gray-600 mb-3">Credenciais de demonstração:</p>
          <div className="space-y-2 text-xs">
            {demoCredentials.map((cred, index) => (
              <div key={index} className="bg-gray-50 p-2 rounded">
                <span className="font-medium">Email:</span> {cred.email}<br />
                <span className="font-medium">CPF:</span> {cred.cpf}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};