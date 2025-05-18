import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './user.model';

export interface ProductAttributes {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  brand: string;
  model: string;
  warranty?: number;
  isNew?: boolean;
  weight?: number;
  width?: number;
  height?: number;
  depth?: number;
  status?: 'active' | 'inactive' | 'pending';
  sellerId: number;
  images?: string[];
  features?: object;
  salesCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductInstance extends Model<ProductAttributes, ProductAttributes>, ProductAttributes {}

const Product = sequelize.define<ProductInstance>(
  'Product',
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
          msg: 'Nome do produto é obrigatório',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Descrição do produto é obrigatória',
        },
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: 'Preço deve ser um valor decimal',
        },
        min: {
          args: [0.01],
          msg: 'Preço deve ser maior que zero',
        },
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: 'Estoque deve ser um número inteiro',
        },
        min: {
          args: [0],
          msg: 'Estoque não pode ser negativo',
        },
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'category_id',
      validate: {
        notNull: {
          msg: 'Categoria é obrigatória',
        },
      },
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Marca é obrigatória',
        },
      },
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Modelo é obrigatório',
        },
      },
    },
    warranty: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    isNew: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_new',
    },
    weight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    width: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    height: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    depth: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'pending'),
      allowNull: false,
      defaultValue: 'active',
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'seller_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    images: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      validate: {
        notEmpty: {
          msg: 'O produto precisa ter pelo menos uma imagem',
        },
      },
    },
    features: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    salesCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'sales_count',
    },
  },
  {
    tableName: 'products',
    underscored: true,
    indexes: [
      {
        fields: ['name'],
      },
      {
        fields: ['category_id'],
      },
      {
        fields: ['seller_id'],
      },
      {
        fields: ['status'],
      },
    ],
  }
);

// Relacionamento com o usuário (vendedor)
Product.belongsTo(User, {
  foreignKey: 'sellerId',
  as: 'seller',
});

User.hasMany(Product, {
  foreignKey: 'sellerId',
  as: 'products',
});

export default Product; 