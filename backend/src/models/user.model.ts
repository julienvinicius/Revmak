import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database';

export interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isActive: boolean;
  // Novos campos
  cpf?: string;
  cnpj?: string;
  phone?: string;
  birthDate?: Date;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserInstance extends Model<UserAttributes, UserAttributes>, UserAttributes {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const User = sequelize.define<UserInstance>(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Nome é obrigatório',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Email inválido',
        },
        notEmpty: {
          msg: 'Email é obrigatório',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 100],
          msg: 'A senha deve ter pelo menos 6 caracteres',
        },
      },
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
    // Novos campos
    cpf: {
      type: DataTypes.STRING(14),
      allowNull: true,
      unique: true,
      field: 'cpf',
    },
    cnpj: {
      type: DataTypes.STRING(18),
      allowNull: true,
      unique: true,
      field: 'cnpj',
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
      field: 'phone',
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'birth_date',
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'address',
    },
    addressNumber: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'address_number',
    },
    complement: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'complement',
    },
    neighborhood: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'neighborhood',
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'city',
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: 'state',
    },
    zipCode: {
      type: DataTypes.STRING(9),
      allowNull: true,
      field: 'zip_code',
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'profile_picture',
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'company_name',
    },
    isSeller: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_seller',
    },
  },
  {
    tableName: 'users',
    underscored: true, // Usar snake_case para nomes de colunas
    // Hooks para hash da senha
    hooks: {
      beforeCreate: async (user: UserInstance) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user: UserInstance) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    }
  }
);

(User as any).prototype.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default User; 