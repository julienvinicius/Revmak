'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import { FaUpload, FaTag, FaBoxOpen, FaDollarSign, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';

export default function AnunciarPage() {
  const { user } = useAuth();
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    titulo: '',
    categoria: '',
    preco: '',
    quantidade: '',
    descricao: '',
    especificacoes: '',
    fotos: [] as File[]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        fotos: [...prev.fotos, ...filesArray]
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index)
    }));
  };

  const goToStep = (step: number) => {
    setFormStep(step);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica para enviar o anúncio
    alert("Anúncio enviado com sucesso! Em breve estará disponível no marketplace.");
  };

  return (
    <ProtectedLayout>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Cabeçalho da página */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
          
          <div className="relative">
            <h1 className="text-3xl font-bold mb-2">Anunciar Produto</h1>
            <p className="text-amber-100">Anuncie seus equipamentos para restaurantes e alcance milhares de compradores.</p>
          </div>
        </div>
        
        {/* Progresso do formulário */}
        <div className="px-6 pt-6">
          <div className="flex mb-8">
            <div className={`flex-1 flex flex-col items-center ${formStep >= 1 ? 'text-amber-600' : 'text-gray-400'}`}>
              <div className={`rounded-full w-8 h-8 flex items-center justify-center border-2 ${formStep >= 1 ? 'border-amber-600 bg-amber-100' : 'border-gray-300'}`}>
                1
              </div>
              <span className="text-xs mt-1">Informações Básicas</span>
            </div>
            <div className={`flex-1 h-0.5 self-center ${formStep >= 2 ? 'bg-amber-500' : 'bg-gray-200'}`}></div>
            <div className={`flex-1 flex flex-col items-center ${formStep >= 2 ? 'text-amber-600' : 'text-gray-400'}`}>
              <div className={`rounded-full w-8 h-8 flex items-center justify-center border-2 ${formStep >= 2 ? 'border-amber-600 bg-amber-100' : 'border-gray-300'}`}>
                2
              </div>
              <span className="text-xs mt-1">Descrição e Detalhes</span>
            </div>
            <div className={`flex-1 h-0.5 self-center ${formStep >= 3 ? 'bg-amber-500' : 'bg-gray-200'}`}></div>
            <div className={`flex-1 flex flex-col items-center ${formStep >= 3 ? 'text-amber-600' : 'text-gray-400'}`}>
              <div className={`rounded-full w-8 h-8 flex items-center justify-center border-2 ${formStep >= 3 ? 'border-amber-600 bg-amber-100' : 'border-gray-300'}`}>
                3
              </div>
              <span className="text-xs mt-1">Fotos do Produto</span>
            </div>
          </div>
        </div>
        
        {/* Formulário de anúncio */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Etapa 1: Informações Básicas */}
          {formStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título do Anúncio*
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Ex: Fogão Industrial 6 Bocas de Alta Pressão"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria*
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="fogoes">Fogões Industriais</option>
                  <option value="refrigeracao">Refrigeração</option>
                  <option value="fornos">Fornos</option>
                  <option value="chapas">Chapas e Fritadeiras</option>
                  <option value="liquidificadores">Liquidificadores</option>
                  <option value="utensilios">Utensílios</option>
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço (R$)*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaDollarSign className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="preco"
                      value={formData.preco}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="0,00"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantidade Disponível*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBoxOpen className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="quantidade"
                      value={formData.quantidade}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="1"
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}
          
          {/* Etapa 2: Descrição e Detalhes */}
          {formStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição Detalhada*
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Descreva o produto em detalhes, incluindo características, benefícios, estado de conservação, etc."
                  required
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especificações Técnicas
                </label>
                <textarea
                  name="especificacoes"
                  value={formData.especificacoes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Informe as especificações técnicas do produto (dimensões, material, potência, etc.)"
                ></textarea>
              </div>
              
              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="border border-amber-500 text-amber-600 hover:bg-amber-50 px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Voltar
                </button>
                
                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}
          
          {/* Etapa 3: Fotos do Produto */}
          {formStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fotos do Produto*
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="space-y-1 text-center">
                    <div className="flex justify-center">
                      <FaUpload className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500">
                        <span>Carregar arquivos</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
                      </label>
                      <p className="pl-1">ou arraste e solte</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF até 10MB (máx. 5 imagens)
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Lista de arquivos selecionados */}
              {formData.fotos.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700">Arquivos selecionados:</h4>
                  <ul className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-md">
                    {formData.fotos.map((file, index) => (
                      <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <FaTag className="flex-shrink-0 h-5 w-5 text-gray-400" />
                          <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="font-medium text-red-600 hover:text-red-500"
                          >
                            Remover
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Aviso sobre regras de anúncio */}
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FaInfoCircle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700">
                      Ao publicar seu anúncio, você concorda com os <Link href="/termos" className="font-medium underline">termos e condições</Link> da RevMak. Seu anúncio será revisado antes de ser publicado.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="border border-amber-500 text-amber-600 hover:bg-amber-50 px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Voltar
                </button>
                
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-2 rounded-lg font-medium transition-colors"
                >
                  Publicar Anúncio
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </ProtectedLayout>
  );
} 