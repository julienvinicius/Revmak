'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import { FaSave, FaArrowLeft, FaUpload, FaTrash, FaPlus } from 'react-icons/fa';
import { BiLoader } from 'react-icons/bi';
import Image from 'next/image';
import Link from 'next/link';

// Categorias simuladas
const categories = [
  { id: '1', name: 'Fogões' },
  { id: '2', name: 'Geladeiras' },
  { id: '3', name: 'Fritadeiras' },
  { id: '4', name: 'Fornos' },
  { id: '5', name: 'Liquidificadores' },
  { id: '6', name: 'Chapas' },
  { id: '7', name: 'Utensílios' },
  { id: '8', name: 'Preparação' },
  { id: '9', name: 'Refrigeração' },
];

// Produtos simulados para edição
const mockProducts = {
  '1': {
    name: 'Fogão Industrial 6 Bocas de Alta Pressão',
    description: 'Fogão industrial de alta pressão com 6 bocas, estrutura em aço inoxidável, ideal para restaurantes de grande porte. Queimadores de alta potência e controle individual de chama.',
    price: '1899.90',
    stock: '12',
    category: '1',
    images: ['/images/restaurante.png', '/images/restaurante.png'],
    isNew: true,
    brand: 'Progás',
    model: 'P6B-30',
    warranty: '12',
    weight: '45',
    dimensions: {
      width: '150',
      height: '85',
      depth: '90',
    },
    features: [
      { key: 'Material', value: 'Aço Inoxidável' },
      { key: 'Tipo de Gás', value: 'GLP/GN' },
      { key: 'Potência', value: '6 queimadores de 120g cada' },
    ],
  },
  '2': {
    name: 'Fritadeira Elétrica Comercial 10L Inox',
    description: 'Fritadeira elétrica em aço inox com capacidade para 10L de óleo. Temperatura ajustável e sistema de segurança contra superaquecimento.',
    price: '699.90',
    stock: '5',
    category: '3',
    images: ['/images/restaurante.png'],
    isNew: true,
    brand: 'Mondial',
    model: 'FT-10',
    warranty: '6',
    weight: '12',
    dimensions: {
      width: '45',
      height: '35',
      depth: '30',
    },
    features: [
      { key: 'Material', value: 'Aço Inoxidável' },
      { key: 'Potência', value: '3000W' },
      { key: 'Voltagem', value: '220V' },
    ],
  },
};

// Interface para o produto
interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  images: string[];
  isNew: boolean;
  brand: string;
  model: string;
  warranty: string;
  weight: string;
  dimensions: {
    width: string;
    height: string;
    depth: string;
  };
  features: { key: string; value: string }[];
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    images: [],
    isNew: true,
    brand: '',
    model: '',
    warranty: '12',
    weight: '',
    dimensions: {
      width: '',
      height: '',
      depth: '',
    },
    features: [{ key: '', value: '' }],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [productNotFound, setProductNotFound] = useState(false);

  // Carregando dados do produto
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        
        // Simular chamada à API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Buscar dados do produto pelo ID
        if (mockProducts[id as keyof typeof mockProducts]) {
          setFormData(mockProducts[id as keyof typeof mockProducts] as ProductFormData);
          setProductNotFound(false);
        } else {
          setProductNotFound(true);
        }
        
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
        alert('Erro ao carregar dados do produto. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [id]);

  // Lidar com mudanças em campos simples
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof ProductFormData],
          [child]: value,
        }
      }));
    } else {
      // Handle regular fields
      setFormData(prev => ({
        ...prev,
        [name]: e.target.type === 'checkbox' 
          ? (e.target as HTMLInputElement).checked 
          : value
      }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Lidar com características personalizadas
  const handleFeatureChange = (index: number, field: 'key' | 'value', value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index][field] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };
  
  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { key: '', value: '' }]
    }));
  };
  
  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };
  
  // Upload de imagem (simulado)
  const handleImageUpload = () => {
    // Em um cenário real, aqui teríamos uma chamada para um serviço de upload
    // Por enquanto, apenas adicionar uma imagem simulada
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '/images/restaurante.png']
    }));
  };
  
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  // Validar formulário
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validações obrigatórias
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Preço é obrigatório';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Preço deve ser um valor positivo';
    }
    
    if (!formData.stock.trim()) {
      newErrors.stock = 'Estoque é obrigatório';
    } else if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Estoque deve ser um número não negativo';
    }
    
    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }
    
    if (!formData.brand.trim()) {
      newErrors.brand = 'Marca é obrigatória';
    }
    
    if (!formData.model.trim()) {
      newErrors.model = 'Modelo é obrigatório';
    }
    
    if (formData.images.length === 0) {
      newErrors.images = 'Pelo menos uma imagem é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll para o primeiro erro
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulando uma chamada API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Aqui enviaria os dados para a API
      console.log('Produto atualizado:', formData);
      
      // Redirecionar para a lista de produtos
      router.push('/meus-produtos');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      alert('Ocorreu um erro ao salvar o produto. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <ProtectedLayout allowedRoles={['admin', 'seller']}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center items-center h-96">
            <BiLoader className="animate-spin text-amber-600 mr-2" size={32} />
            <p className="text-gray-600 text-lg">Carregando produto...</p>
          </div>
        </div>
      </ProtectedLayout>
    );
  }
  
  if (productNotFound) {
    return (
      <ProtectedLayout allowedRoles={['admin', 'seller']}>
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center mb-6">
              <Link 
                href="/meus-produtos" 
                className="mr-4 text-gray-600 hover:text-amber-600 transition-colors"
              >
                <FaArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Produto não encontrado</h1>
            </div>
            
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-600 mb-4">O produto que você está procurando não foi encontrado.</p>
              <Link 
                href="/meus-produtos" 
                className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
              >
                Voltar para a lista de produtos
              </Link>
            </div>
          </div>
        </div>
      </ProtectedLayout>
    );
  }
  
  return (
    <ProtectedLayout allowedRoles={['admin', 'seller']}>
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Link 
                href="/meus-produtos" 
                className="mr-4 text-gray-600 hover:text-amber-600 transition-colors"
              >
                <FaArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Editar Produto</h1>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informações básicas */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações Básicas</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Produto*
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:ring-amber-500 focus:border-amber-500`}
                    placeholder="Nome do produto"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria*
                  </label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:ring-amber-500 focus:border-amber-500`}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marca*
                  </label>
                  <input 
                    type="text" 
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className={`w-full border ${errors.brand ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:ring-amber-500 focus:border-amber-500`}
                    placeholder="Ex: Tramontina"
                  />
                  {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modelo*
                  </label>
                  <input 
                    type="text" 
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className={`w-full border ${errors.model ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:ring-amber-500 focus:border-amber-500`}
                    placeholder="Ex: XYZ-1000"
                  />
                  {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model}</p>}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição do Produto*
                  </label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:ring-amber-500 focus:border-amber-500`}
                    placeholder="Descreva detalhadamente o produto..."
                  ></textarea>
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço (R$)*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">R$</span>
                    </div>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className={`w-full pl-10 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:ring-amber-500 focus:border-amber-500`}
                      placeholder="0,00"
                    />
                  </div>
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estoque (unidades)*
                  </label>
                  <input 
                    type="number" 
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    className={`w-full border ${errors.stock ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:ring-amber-500 focus:border-amber-500`}
                    placeholder="0"
                  />
                  {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isNew"
                    name="isNew"
                    checked={formData.isNew}
                    onChange={(e) => setFormData(prev => ({ ...prev, isNew: e.target.checked }))}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isNew" className="ml-2 block text-sm text-gray-700">
                    Produto novo (não usado)
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Garantia (meses)
                  </label>
                  <input 
                    type="number" 
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="12"
                  />
                </div>
              </div>
            </div>
            
            {/* Dimensões e peso */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Dimensões e Peso</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Largura (cm)
                  </label>
                  <input 
                    type="text" 
                    name="dimensions.width"
                    value={formData.dimensions.width}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Altura (cm)
                  </label>
                  <input 
                    type="text" 
                    name="dimensions.height"
                    value={formData.dimensions.height}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profundidade (cm)
                  </label>
                  <input 
                    type="text" 
                    name="dimensions.depth"
                    value={formData.dimensions.depth}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peso (kg)
                  </label>
                  <input 
                    type="text" 
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            
            {/* Características técnicas */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Características Técnicas</h2>
                <button 
                  type="button"
                  onClick={addFeature}
                  className="inline-flex items-center text-sm text-amber-600 hover:text-amber-800"
                >
                  <FaPlus className="mr-1" />
                  Adicionar característica
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-grow">
                      <input 
                        type="text" 
                        value={feature.key}
                        onChange={(e) => handleFeatureChange(index, 'key', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-amber-500 focus:border-amber-500 mb-2"
                        placeholder="Característica (ex: Material)"
                      />
                      <input 
                        type="text" 
                        value={feature.value}
                        onChange={(e) => handleFeatureChange(index, 'value', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Valor (ex: Inox)"
                      />
                    </div>
                    {index > 0 && (
                      <button 
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Imagens */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Imagens do Produto*</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative border border-gray-200 rounded-lg overflow-hidden group">
                    <div className="aspect-square relative">
                      <Image 
                        src={image} 
                        alt={`Imagem ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
                
                <button 
                  type="button"
                  onClick={handleImageUpload}
                  className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 hover:border-amber-500 transition-colors aspect-square"
                >
                  <FaUpload className="text-gray-400 mb-2" size={24} />
                  <span className="text-sm text-gray-500">Adicionar Imagem</span>
                </button>
              </div>
              {errors.images && <p className="mt-2 text-sm text-red-600">{errors.images}</p>}
              <p className="mt-2 text-xs text-gray-500">
                * Formatos aceitos: JPEG, PNG ou WebP. Tamanho máximo: 5MB por imagem. A primeira imagem será a principal.
              </p>
            </div>
            
            {/* Botões de formulário */}
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <Link 
                href="/meus-produtos" 
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
              >
                Cancelar
              </Link>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <BiLoader className="animate-spin mr-2" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Atualizar Produto
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedLayout>
  );
} 