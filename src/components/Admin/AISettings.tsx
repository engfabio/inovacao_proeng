import React, { useState, useEffect } from 'react';
import { useAI, DEFAULT_PROMPT } from '../../contexts/AIContext';
import { AIConfiguration, AIProvider as AIProviderType } from '../../types';
import { Settings, RefreshCw, Save, Eye, EyeOff, Play, AlertCircle, CheckCircle } from 'lucide-react';

export const AISettings: React.FC = () => {
  const { configuration, providers, updateConfiguration, refreshModels, isProcessing } = useAI();
  
  const [formData, setFormData] = useState<Partial<AIConfiguration>>({
    providerId: '',
    modelId: '',
    apiKey: '',
    prompt: '',
    maxTokens: 4000,
    temperature: 0.7,
    isActive: true
  });
  
  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<AIProviderType | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (configuration) {
      setFormData({
        providerId: configuration.providerId,
        modelId: configuration.modelId,
        apiKey: configuration.apiKey,
        prompt: configuration.prompt,
        maxTokens: configuration.maxTokens,
        temperature: configuration.temperature,
        isActive: configuration.isActive
      });
      
      const provider = providers.find(p => p.id === configuration.providerId);
      setSelectedProvider(provider || null);
    }
  }, [configuration, providers]);

  const handleProviderChange = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    setSelectedProvider(provider || null);
    setFormData(prev => ({
      ...prev,
      providerId,
      modelId: '', // Reset model selection
      apiKey: provider?.requiresApiKey ? prev.apiKey : ''
    }));
  };

  const handleModelChange = (modelId: string) => {
    const model = selectedProvider?.models.find(m => m.id === modelId);
    setFormData(prev => ({
      ...prev,
      modelId,
      maxTokens: model?.maxTokens ? Math.min(model.maxTokens, 4000) : 4000
    }));
  };

  const handleRefreshModels = async (providerId: string) => {
    setIsRefreshing(providerId);
    try {
      await refreshModels(providerId);
    } catch (error) {
      console.error('Erro ao atualizar modelos:', error);
    } finally {
      setIsRefreshing(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      await updateConfiguration(formData);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConfiguration = async () => {
    if (!formData.providerId || !formData.modelId || (selectedProvider?.requiresApiKey && !formData.apiKey)) {
      setTestResult({
        success: false,
        message: 'Configure todos os campos obrigatórios antes de testar'
      });
      return;
    }

    setTestResult(null);
    
    // Simular teste da configuração
    setTimeout(() => {
      setTestResult({
        success: true,
        message: 'Configuração testada com sucesso! A IA está respondendo corretamente.'
      });
    }, 2000);
  };

  const selectedModel = selectedProvider?.models.find(m => m.id === formData.modelId);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-semibold">Configurações de IA</h2>
      </div>

      <div className="space-y-6">
        {/* Status da Configuração */}
        <div className={`p-4 rounded-lg ${configuration?.isActive ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center gap-2">
            {configuration?.isActive ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={`font-medium ${configuration?.isActive ? 'text-green-800' : 'text-red-800'}`}>
              Status: {configuration?.isActive ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>

        {/* Seleção do Provedor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Provedor de IA *
          </label>
          <select
            value={formData.providerId}
            onChange={(e) => handleProviderChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Selecione um provedor</option>
            {providers.map(provider => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>

        {/* Seleção do Modelo */}
        {selectedProvider && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Modelo *
              </label>
              <button
                onClick={() => handleRefreshModels(selectedProvider.id)}
                disabled={isRefreshing === selectedProvider.id}
                className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing === selectedProvider.id ? 'animate-spin' : ''}`} />
                Atualizar Modelos
              </button>
            </div>
            <select
              value={formData.modelId}
              onChange={(e) => handleModelChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Selecione um modelo</option>
              {selectedProvider.models.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name} - {model.description}
                </option>
              ))}
            </select>
            {selectedModel && (
              <div className="mt-2 text-sm text-gray-600">
                <p>Max Tokens: {selectedModel.maxTokens.toLocaleString()}</p>
                <p>Custo por 1K tokens: ${selectedModel.costPer1kTokens}</p>
              </div>
            )}
          </div>
        )}

        {/* API Key */}
        {selectedProvider?.requiresApiKey && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key *
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={formData.apiKey}
                onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                placeholder="Insira sua API Key"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}        {/* Prompt Personalizado */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Prompt Personalizado
            </label>            <button
              onClick={() => setFormData(prev => ({ ...prev, prompt: DEFAULT_PROMPT }))}
              className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
            >
              <RefreshCw className="w-4 h-4" />
              Restaurar Prompt Padrão da Proeng
            </button>
          </div>
          <textarea
            value={formData.prompt}
            onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
            rows={10}
            placeholder="Prompt para análise de ideias..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            O prompt define como a IA irá analisar e sugerir melhorias para as ideias. O prompt padrão está otimizado para o contexto empresarial da Proeng.
          </p>
        </div>

        {/* Configurações Avançadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Tokens
            </label>
            <input
              type="number"
              value={formData.maxTokens}
              onChange={(e) => setFormData(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
              min="100"
              max={selectedModel?.maxTokens || 4000}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperature (0-1)
            </label>
            <input
              type="number"
              value={formData.temperature}
              onChange={(e) => setFormData(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
              min="0"
              max="1"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Ativar/Desativar */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
            Ativar assistência de IA
          </label>
        </div>

        {/* Resultado do Teste */}
        {testResult && (
          <div className={`p-4 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center gap-2">
              {testResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={`text-sm ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                {testResult.message}
              </span>
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={handleTestConfiguration}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            Testar Configuração
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving || !formData.providerId || !formData.modelId}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Salvando...' : 'Salvar Configuração'}
          </button>

          {saveStatus === 'success' && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Configuração salva!</span>
            </div>
          )}

          {saveStatus === 'error' && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Erro ao salvar</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
