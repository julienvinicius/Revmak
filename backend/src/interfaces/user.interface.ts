// Esta interface não é mais necessária pois estamos usando as interfaces definidas no modelo
// Mantendo este arquivo apenas para compatibilidade com o código existente

import { UserAttributes, UserInstance } from '../models/user.model';

export type IUser = UserInstance;
export type IUserAttributes = UserAttributes; 