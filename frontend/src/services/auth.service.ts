import api from './api';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  cpf?: string;
  cnpj?: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  profilePicture?: string;
  companyName?: string;
  isSeller?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  status: string;
  token: string;
  data: {
    user: UserData;
  };
}

// Função para registrar um novo usuário
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  
  // Salvar o token no localStorage
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  
  return response.data;
};

// Função para fazer login
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  
  // Salvar o token no localStorage
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  
  return response.data;
};

// Função para fazer logout
export const logout = async (): Promise<void> => {
  await api.get('/auth/logout');
  localStorage.removeItem('token');
};

// Função para obter o usuário atual
export const getCurrentUser = async (): Promise<UserData> => {
  const response = await api.get<{ status: string; data: { user: UserData } }>('/auth/me');
  return response.data.data.user;
};

// Função para atualizar a senha
export const updatePassword = async (data: UpdatePasswordData): Promise<AuthResponse> => {
  const response = await api.patch<AuthResponse>('/auth/update-password', data);
  
  // Atualizar o token no localStorage
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  
  return response.data;
}; 