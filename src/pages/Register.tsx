import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { departments, positions } from '../data/mockData';
import { Lightbulb, ArrowLeft } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    department: '',
    position: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        cpf: formData.cpf,
        department: formData.department,
        position: formData.position,
        password: formData.password
      });
      navigate('/');
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <Lightbulb className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Cadastro de Usuário</h1>
          <p className="text-gray-600 mt-2">Crie sua conta para participar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="label">
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            <div>
              <label htmlFor="email" className="label">
                E-mail Corporativo
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

            <div>
              <label htmlFor="department" className="label">
                Departamento
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="">Selecione...</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="position" className="label">
                Cargo
              </label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="">Selecione...</option>
                {positions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="password" className="label">
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="input"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="input"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <Link to="/login" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao login</span>
            </Link>

            <button type="submit" className="btn-primary">
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};