import api from './api';
import { UserData } from './auth.service';

export interface UpdateUserData {
  name?: string;
  email?: string;
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
  currentPassword?: string;
  password?: string;
}

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
}

export interface AdminUpdateUserData extends UpdateUserData {
  role?: 'user' | 'admin';
  isActive?: boolean;
}

// Função para atualizar dados do usuário atual
export const updateCurrentUser = async (data: UpdateUserData): Promise<UserData> => {
  const response = await api.patch<{ status: string; data: { user: UserData } }>(
    '/users/update-me',
    data
  );
  return response.data.data.user;
};

// Função para atualizar senha do usuário atual
export const updatePassword = async (data: PasswordUpdateData): Promise<void> => {
  await api.patch('/users/update-password', data);
};

// Função para desativar a conta do usuário atual
export const deleteCurrentUser = async (): Promise<void> => {
  await api.delete('/users/delete-me');
  localStorage.removeItem('token');
};

// Funções administrativas

// Obter todos os usuários (admin)
export const getAllUsers = async (): Promise<UserData[]> => {
  const response = await api.get<{ status: string; results: number; data: { users: UserData[] } }>(
    '/users'
  );
  return response.data.data.users;
};

// Obter um usuário pelo ID (admin)
export const getUserById = async (id: string): Promise<UserData> => {
  const response = await api.get<{ status: string; data: { user: UserData } }>(
    `/users/${id}`
  );
  return response.data.data.user;
};

// Atualizar um usuário pelo ID (admin)
export const updateUser = async (id: string, data: AdminUpdateUserData): Promise<UserData> => {
  const response = await api.patch<{ status: string; data: { user: UserData } }>(
    `/users/${id}`,
    data
  );
  return response.data.data.user;
};

// Excluir um usuário pelo ID (admin)
export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
}; 