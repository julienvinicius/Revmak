import api from './api';
import { UserData } from './auth.service';

export interface UpdateUserData {
  name?: string;
  email?: string;
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