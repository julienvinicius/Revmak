'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import * as userService from '@/services/user.service';
import { updatePassword } from '@/services/auth.service';
import { Tab } from '@headlessui/react';
import { FaIdCard, FaBuilding, FaBox, FaLock, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

// Interface para tipos de campos do usuário
interface UserFormData {
  name: string;
  email: string;
  cpf: string;
  cnpj: string;
  phone: string;
  birthDate: string;
  address: string;
  addressNumber: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  companyName: string;
  isSeller: boolean;
}

// Lista de estados brasileiros
const ESTADOS_BRASILEIROS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export default function ProfilePage() {
  const { user, connectionError, updateUserData } = useAuth();
  const [formData, setFormData] = useState<UserFormData>({
    name: user?.name || '',
    email: user?.email || '',
    cpf: user?.cpf || '',
    cnpj: user?.cnpj || '',
    phone: user?.phone || '',
    birthDate: user?.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
    address: user?.address || '',
    addressNumber: user?.addressNumber || '',
    complement: user?.complement || '',
    neighborhood: user?.neighborhood || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    companyName: user?.companyName || '',
    isSeller: user?.isSeller || false
  });

  // Campos de senha
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estados de UI
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [isBecomingSeller, setIsBecomingSeller] = useState(false);

  // Verifica se o usuário está tentando se tornar vendedor
  useEffect(() => {
    if (formData.isSeller && !user?.isSeller) {
      setIsBecomingSeller(true);
    } else {
      setIsBecomingSeller(false);
    }
  }, [formData.isSeller, user?.isSeller]);

  if (!user) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData({
      ...formData,
      [name]: newValue
    });
  };

  // Validar CPF (simplificado)
  const validateCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    return cleanCPF.length === 11 || cpf === '';
  };

  // Validar CNPJ (simplificado)
  const validateCNPJ = (cnpj: string) => {
    const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
    return cleanCNPJ.length === 14 || cnpj === '';
  };

  // Formatar CPF ao digitar
  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
  };

  // Formatar CNPJ ao digitar
  const formatCNPJ = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
    if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
  };

  // Formatar CEP ao digitar
  const formatCEP = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
  };

  // Formatar telefone ao digitar
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handleSpecialInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'cnpj') {
      formattedValue = formatCNPJ(value);
    } else if (name === 'zipCode') {
      formattedValue = formatCEP(value);
    } else if (name === 'phone') {
      formattedValue = formatPhone(value);
    }
    
    setFormData({
      ...formData,
      [name]: formattedValue
    });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (isBecomingSeller) {
      if (!formData.phone) {
        setValidationError('Telefone é obrigatório para vendedores');
        return;
      }
      if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
        setValidationError('Endereço completo é obrigatório para vendedores');
        return;
      }
    }
    
    if (formData.cpf && !validateCPF(formData.cpf)) {
      setValidationError('CPF inválido');
      return;
    }
    
    if (formData.cnpj && !validateCNPJ(formData.cnpj)) {
      setValidationError('CNPJ inválido');
      return;
    }
    
    setIsUpdating(true);
    setUpdateSuccess(false);
    setValidationError('');

    try {
      const updatedUser = await userService.updateCurrentUser(formData);
      updateUserData(updatedUser);
      setUpdateSuccess(true);
      window.scrollTo({top: 0, behavior: 'smooth'});
    } catch (err: any) {
      setValidationError(err.response?.data?.message || 'Erro ao atualizar perfil');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setPasswordSuccess(false);
    setValidationError('');

    if (newPassword !== confirmPassword) {
      setValidationError('As senhas não coincidem');
      setIsChangingPassword(false);
      return;
    }

    if (newPassword.length < 6) {
      setValidationError('A senha deve ter pelo menos 6 caracteres');
      setIsChangingPassword(false);
      return;
    }

    try {
      await updatePassword({
        currentPassword,
        newPassword
      });
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setValidationError(err.response?.data?.message || 'Erro ao atualizar senha');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const tabClassNames = ({ selected }: { selected: boolean }) => 
    `relative flex items-center justify-center w-full py-3 px-2 rounded-lg text-sm font-medium leading-5 
    transition-all duration-200 ease-in-out
    ${selected 
      ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg' 
      : 'text-amber-800 hover:bg-amber-100'
    }`;
  
  return (
    <ProtectedLayout>
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white shadow-lg">
            <FaUser className="text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{user?.name || 'Seu Perfil'}</h1>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Mensagens de sucesso/erro */}
        {updateSuccess && (
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-lg shadow-lg mb-6 transform transition-all animate-fadeIn">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Perfil atualizado com sucesso!</span>
            </div>
          </div>
        )}
        
        {passwordSuccess && (
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-lg shadow-lg mb-6 transform transition-all animate-fadeIn">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Senha alterada com sucesso!</span>
            </div>
          </div>
        )}
        
        {validationError && (
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-lg shadow-lg mb-6">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{validationError}</span>
            </div>
          </div>
        )}

        <Tab.Group onChange={setActiveTab}>
          <Tab.List className="flex rounded-xl bg-white p-2 mb-8 shadow-lg">
            <Tab className={tabClassNames}>
              <FaIdCard className="mr-2" /> Informações Pessoais
            </Tab>
            
            <Tab className={tabClassNames}>
              <FaBuilding className="mr-2" /> Endereço
            </Tab>
            
            <Tab className={tabClassNames}>
              <FaBox className="mr-2" /> Informações de Vendedor
            </Tab>
            
            <Tab className={tabClassNames}>
              <FaLock className="mr-2" /> Segurança
            </Tab>
          </Tab.List>
          
          <Tab.Panels className="mt-2">
            {/* Painel 1: Informações Pessoais */}
            <Tab.Panel>
              <div className="bg-white rounded-xl shadow-lg p-8 mb-6 transition-all duration-300 hover:shadow-xl border border-gray-100">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-4">Informações Pessoais</h2>

                <form onSubmit={handleUpdateProfile}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="mb-4">
                      <label htmlFor="name" className="flex items-center text-gray-700 font-medium mb-2">
                        <FaUser className="mr-2 text-amber-500" />
                        Nome Completo *
                      </label>
                      <div className="relative">
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="email" className="flex items-center text-gray-700 font-medium mb-2">
                        <FaEnvelope className="mr-2 text-amber-500" />
                        Email *
                      </label>
                      <div className="relative">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="cpf" className="flex items-center text-gray-700 font-medium mb-2">
                        <FaIdCard className="mr-2 text-amber-500" />
                        CPF
                      </label>
                      <div className="relative">
                        <input
                          id="cpf"
                          name="cpf"
                          type="text"
                          value={formData.cpf}
                          onChange={handleSpecialInputChange}
                          placeholder="123.456.789-01"
                          maxLength={14}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="phone" className="flex items-center text-gray-700 font-medium mb-2">
                        <FaPhone className="mr-2 text-amber-500" />
                        Telefone {formData.isSeller && <span className="text-amber-600 ml-1">*</span>}
                      </label>
                      <div className="relative">
                        <input
                          id="phone"
                          name="phone"
                          type="text"
                          value={formData.phone}
                          onChange={handleSpecialInputChange}
                          placeholder="(11) 98765-4321"
                          maxLength={15}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                          required={formData.isSeller}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="birthDate" className="flex items-center text-gray-700 font-medium mb-2">
                        <FaCalendarAlt className="mr-2 text-amber-500" />
                        Data de Nascimento
                      </label>
                      <div className="relative">
                        <input
                          id="birthDate"
                          name="birthDate"
                          type="date"
                          value={formData.birthDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 
                      ${isUpdating 
                        ? 'bg-amber-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 shadow-lg hover:shadow-amber-200/50'
                      }`}
                    >
                      {isUpdating ? 'Atualizando...' : 'Salvar Alterações'}
                    </button>
                  </div>
                </form>
              </div>
            </Tab.Panel>

            {/* Painel 2: Endereço */}
            <Tab.Panel>
              <div className="bg-white rounded-xl shadow-lg p-8 mb-6 transition-all duration-300 hover:shadow-xl border border-gray-100">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-4">Endereço</h2>
                
                <p className="mb-6 text-gray-600 bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
                  {formData.isSeller 
                    ? 'Esses dados são obrigatórios para vendedores.' 
                    : 'Preencha seu endereço para facilitar suas compras.'}
                </p>

                <form onSubmit={handleUpdateProfile}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="mb-4">
                      <label htmlFor="zipCode" className="flex items-center text-gray-700 font-medium mb-2">
                        <FaMapMarkerAlt className="mr-2 text-amber-500" />
                        CEP {formData.isSeller && <span className="text-amber-600 ml-1">*</span>}
                      </label>
                      <div className="relative">
                        <input
                          id="zipCode"
                          name="zipCode"
                          type="text"
                          value={formData.zipCode}
                          onChange={handleSpecialInputChange}
                          placeholder="12345-678"
                          maxLength={9}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                          required={formData.isSeller}
                        />
                      </div>
                    </div>

                    <div className="mb-4 md:col-span-2">
                      <label htmlFor="address" className="flex items-center text-gray-700 font-medium mb-2">
                        <FaBuilding className="mr-2 text-amber-500" />
                        Endereço {formData.isSeller && <span className="text-amber-600 ml-1">*</span>}
                      </label>
                      <div className="relative">
                        <input
                          id="address"
                          name="address"
                          type="text"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Rua, Avenida, etc."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                          required={formData.isSeller}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="addressNumber" className="flex items-center text-gray-700 font-medium mb-2">
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center mr-2 text-xs font-bold">Nº</span>
                        Número {formData.isSeller && <span className="text-amber-600 ml-1">*</span>}
                      </label>
                      <div className="relative">
                        <input
                          id="addressNumber"
                          name="addressNumber"
                          type="text"
                          value={formData.addressNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                          required={formData.isSeller}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="complement" className="flex items-center text-gray-700 font-medium mb-2">
                        <span className="mr-2 text-amber-500">+</span>
                        Complemento
                      </label>
                      <div className="relative">
                        <input
                          id="complement"
                          name="complement"
                          type="text"
                          value={formData.complement}
                          onChange={handleInputChange}
                          placeholder="Apto, Bloco, etc."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="neighborhood" className="flex items-center text-gray-700 font-medium mb-2">
                        <FaMapMarkerAlt className="mr-2 text-amber-500" />
                        Bairro {formData.isSeller && <span className="text-amber-600 ml-1">*</span>}
                      </label>
                      <div className="relative">
                        <input
                          id="neighborhood"
                          name="neighborhood"
                          type="text"
                          value={formData.neighborhood}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                          required={formData.isSeller}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="city" className="flex items-center text-gray-700 font-medium mb-2">
                        <FaBuilding className="mr-2 text-amber-500" />
                        Cidade {formData.isSeller && <span className="text-amber-600 ml-1">*</span>}
                      </label>
                      <div className="relative">
                        <input
                          id="city"
                          name="city"
                          type="text"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                          required={formData.isSeller}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="state" className="flex items-center text-gray-700 font-medium mb-2">
                        <FaMapMarkerAlt className="mr-2 text-amber-500" />
                        Estado {formData.isSeller && <span className="text-amber-600 ml-1">*</span>}
                      </label>
                      <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                        required={formData.isSeller}
                      >
                        <option value="">Selecione um estado</option>
                        {ESTADOS_BRASILEIROS.map(estado => (
                          <option key={estado} value={estado}>{estado}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 
                      ${isUpdating 
                        ? 'bg-amber-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 shadow-lg hover:shadow-amber-200/50'
                      }`}
                    >
                      {isUpdating ? 'Atualizando...' : 'Salvar Alterações'}
                    </button>
                  </div>
                </form>
              </div>
            </Tab.Panel>

            {/* Painel 3: Informações de Vendedor */}
            <Tab.Panel>
              <div className="bg-white rounded-xl shadow-lg p-8 mb-6 transition-all duration-300 hover:shadow-xl border border-gray-100">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-4">Informações de Vendedor</h2>
                
                {!user?.isSeller && !formData.isSeller && (
                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 text-amber-800 p-6 rounded-lg mb-6 shadow-inner">
                    <h3 className="font-bold text-lg mb-2 flex items-center">
                      <svg className="w-6 h-6 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                      </svg>
                      Torne-se um vendedor RevMak!
                    </h3>
                    <p>Para vender na RevMak, você precisará ativar seu perfil de vendedor e completar seus dados. Vendedores têm acesso ao painel de controle para gerenciar produtos e vendas.</p>
                  </div>
                )}

                <form onSubmit={handleUpdateProfile}>
                  <div className="mb-8">
                    <label className="flex items-center pl-4 pr-6 py-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="isSeller"
                          checked={formData.isSeller}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className={`w-10 h-6 bg-gray-200 rounded-full shadow-inner ${formData.isSeller ? 'bg-amber-500' : ''}`}></div>
                        <div className={`absolute w-4 h-4 bg-white rounded-full shadow -top-1 transition ${formData.isSeller ? 'transform translate-x-6' : 'translate-x-1'}`}></div>
                      </div>
                      <span className="ml-4 text-gray-700 font-medium">Ativar perfil de vendedor</span>
                    </label>
                  </div>
                  
                  {formData.isSeller && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="mb-4 md:col-span-2">
                          <label htmlFor="companyName" className="flex items-center text-gray-700 font-medium mb-2">
                            <FaBuilding className="mr-2 text-amber-500" />
                            Nome da Empresa/Negócio <span className="text-amber-600 ml-1">*</span>
                          </label>
                          <div className="relative">
                            <input
                              id="companyName"
                              name="companyName"
                              type="text"
                              value={formData.companyName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                              required={formData.isSeller}
                            />
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <label htmlFor="cnpj" className="flex items-center text-gray-700 font-medium mb-2">
                            <FaIdCard className="mr-2 text-amber-500" />
                            CNPJ (opcional para pessoa jurídica)
                          </label>
                          <div className="relative">
                            <input
                              id="cnpj"
                              name="cnpj"
                              type="text"
                              value={formData.cnpj}
                              onChange={handleSpecialInputChange}
                              placeholder="12.345.678/0001-90"
                              maxLength={18}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {isBecomingSeller && (
                        <div className="mt-6 bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-6 rounded-r-lg">
                          <h3 className="font-bold text-blue-800 mb-2 flex items-center">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Importante
                          </h3>
                          <p className="text-blue-800">
                            Para se tornar um vendedor, você precisa completar seu endereço e informações pessoais. 
                            Por favor, certifique-se de que todos os campos obrigatórios estão preenchidos.
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex justify-end mt-8">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 
                      ${isUpdating 
                        ? 'bg-amber-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 shadow-lg hover:shadow-amber-200/50'
                      }`}
                    >
                      {isUpdating ? 'Atualizando...' : 'Salvar Alterações'}
                    </button>
                  </div>
                </form>
              </div>
            </Tab.Panel>

            {/* Painel 4: Segurança */}
            <Tab.Panel>
              <div className="bg-white rounded-xl shadow-lg p-8 mb-6 transition-all duration-300 hover:shadow-xl border border-gray-100">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-4">Alterar Senha</h2>

                <form onSubmit={handleChangePassword}>
                  <div className="mb-6">
                    <label htmlFor="currentPassword" className="flex items-center text-gray-700 font-medium mb-2">
                      <FaLock className="mr-2 text-amber-500" />
                      Senha Atual
                    </label>
                    <div className="relative">
                      <input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="newPassword" className="flex items-center text-gray-700 font-medium mb-2">
                      <FaLock className="mr-2 text-amber-500" />
                      Nova Senha
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                        required
                        minLength={6}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">A senha deve ter pelo menos 6 caracteres</p>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="confirmPassword" className="flex items-center text-gray-700 font-medium mb-2">
                      <FaLock className="mr-2 text-amber-500" />
                      Confirmar Nova Senha
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-8">
                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 
                      ${isChangingPassword 
                        ? 'bg-amber-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 shadow-lg hover:shadow-amber-200/50'
                      }`}
                    >
                      {isChangingPassword ? 'Alterando...' : 'Alterar Senha'}
                    </button>
                  </div>
                </form>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </ProtectedLayout>
  );
} 