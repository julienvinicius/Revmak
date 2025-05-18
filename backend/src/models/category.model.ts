import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Product from './product.model';

export interface CategoryAttributes {
  id?: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parentId?: number | null;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryInstance extends Model<CategoryAttributes, CategoryAttributes>, CategoryAttributes {}

const Category = sequelize.define<CategoryInstance>(
  'Category',
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
          msg: 'Nome da categoria é obrigatório',
        },
      },
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'Slug da categoria é obrigatório',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'parent_id',
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    tableName: 'categories',
    underscored: true,
    indexes: [
      {
        fields: ['slug'],
        unique: true,
      },
      {
        fields: ['parent_id'],
      },
    ],
    hooks: {
      beforeCreate: (category: CategoryInstance) => {
        // Converter o nome para slug se o slug não estiver definido
        if (!category.slug && category.name) {
          category.slug = category.name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
            .replace(/\s+/g, '-') // Converte espaços em hífens
            .replace(/--+/g, '-') // Remove hífens duplicados
            .trim();
        }
      },
      beforeUpdate: (category: CategoryInstance) => {
        // Atualizar o slug se o nome for alterado e o slug não for explicitamente definido
        if (category.changed('name') && !category.changed('slug')) {
          category.slug = category.name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim();
        }
      },
    },
  }
);

// Relacionamentos
Category.hasMany(Product, {
  foreignKey: 'categoryId',
  as: 'products',
});

Product.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

// Auto-relacionamento para categorias pai/filho
Category.belongsTo(Category, {
  foreignKey: 'parentId',
  as: 'parentCategory',
});

Category.hasMany(Category, {
  foreignKey: 'parentId',
  as: 'subcategories',
});

export default Category; 