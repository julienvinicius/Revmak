import { Request, Response } from 'express';
import Category, { CategoryAttributes } from '../models/category.model';
import { Op } from 'sequelize';

class CategoryController {
  /**
   * Cria uma nova categoria
   */
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      // Verificar se o usuário é admin
      if (req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Apenas administradores podem criar categorias',
        });
      }

      // Se for informado parentId, verificar se a categoria pai existe
      if (req.body.parentId) {
        const parentCategory = await Category.findByPk(req.body.parentId);
        
        if (!parentCategory) {
          return res.status(404).json({
            success: false,
            message: 'Categoria pai não encontrada',
          });
        }
      }

      // Criar a categoria
      const categoryData: CategoryAttributes = req.body;
      const category = await Category.create(categoryData);

      return res.status(201).json({
        success: true,
        message: 'Categoria criada com sucesso',
        data: category,
      });
    } catch (error: any) {
      console.error('Erro ao criar categoria:', error);
      
      // Verificar se é um erro de validação do Sequelize
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((e: any) => ({
          field: e.path,
          message: e.message,
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Erro de validação',
          errors: validationErrors,
        });
      }
      
      // Verificar se é um erro de unicidade (slug duplicado)
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'Já existe uma categoria com este slug',
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erro ao criar categoria',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Atualiza uma categoria existente
   */
  public async update(req: Request, res: Response): Promise<Response> {
    try {
      // Verificar se o usuário é admin
      if (req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Apenas administradores podem atualizar categorias',
        });
      }

      const categoryId = req.params.id;
      
      // Verificar se a categoria existe
      const category = await Category.findByPk(categoryId);
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada',
        });
      }

      // Se estiver atualizando o parentId, verificar se a categoria pai existe e não é ela mesma
      if (req.body.parentId !== undefined) {
        if (req.body.parentId === categoryId) {
          return res.status(400).json({
            success: false,
            message: 'Uma categoria não pode ser pai dela mesma',
          });
        }
        
        if (req.body.parentId) {
          const parentCategory = await Category.findByPk(req.body.parentId);
          
          if (!parentCategory) {
            return res.status(404).json({
              success: false,
              message: 'Categoria pai não encontrada',
            });
          }
          
          // Verificar se a categoria pai não é uma subcategoria desta categoria (evitar loops)
          const isSubcategory = await checkIfSubcategory(req.body.parentId, categoryId);
          
          if (isSubcategory) {
            return res.status(400).json({
              success: false,
              message: 'Não é possível criar hierarquias cíclicas de categorias',
            });
          }
        }
      }

      // Atualizar a categoria
      await category.update(req.body);

      return res.status(200).json({
        success: true,
        message: 'Categoria atualizada com sucesso',
        data: category,
      });
    } catch (error: any) {
      console.error('Erro ao atualizar categoria:', error);
      
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((e: any) => ({
          field: e.path,
          message: e.message,
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Erro de validação',
          errors: validationErrors,
        });
      }
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'Já existe uma categoria com este slug',
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erro ao atualizar categoria',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Lista todas as categorias
   */
  public async listAll(req: Request, res: Response): Promise<Response> {
    try {
      // Parâmetros
      const includeInactive = req.query.includeInactive === 'true';
      
      // Filtro
      const where: any = {};
      
      if (!includeInactive) {
        where.isActive = true;
      }
      
      // Buscar categorias
      const categories = await Category.findAll({
        where,
        include: [
          {
            model: Category,
            as: 'subcategories',
            required: false,
            attributes: ['id', 'name', 'slug', 'icon', 'isActive'],
            where: includeInactive ? {} : { isActive: true },
          },
        ],
        order: [
          ['name', 'ASC'],
          [{ model: Category, as: 'subcategories' }, 'name', 'ASC'],
        ],
      });

      return res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error: any) {
      console.error('Erro ao listar categorias:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Erro ao listar categorias',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Busca uma categoria pelo ID
   */
  public async getById(req: Request, res: Response): Promise<Response> {
    try {
      const categoryId = req.params.id;
      
      const category = await Category.findByPk(categoryId, {
        include: [
          {
            model: Category,
            as: 'subcategories',
            required: false,
            attributes: ['id', 'name', 'slug', 'icon', 'isActive'],
          },
          {
            model: Category,
            as: 'parentCategory',
            required: false,
            attributes: ['id', 'name', 'slug'],
          },
        ],
      });
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada',
        });
      }

      return res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error: any) {
      console.error('Erro ao buscar categoria:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar categoria',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Busca uma categoria pelo slug
   */
  public async getBySlug(req: Request, res: Response): Promise<Response> {
    try {
      const slug = req.params.slug;
      
      const category = await Category.findOne({
        where: { slug },
        include: [
          {
            model: Category,
            as: 'subcategories',
            required: false,
            attributes: ['id', 'name', 'slug', 'icon', 'isActive'],
            where: { isActive: true },
          },
          {
            model: Category,
            as: 'parentCategory',
            required: false,
            attributes: ['id', 'name', 'slug'],
          },
        ],
      });
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada',
        });
      }

      return res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error: any) {
      console.error('Erro ao buscar categoria:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar categoria',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Deleta uma categoria
   */
  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      // Verificar se o usuário é admin
      if (req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Apenas administradores podem excluir categorias',
        });
      }

      const categoryId = req.params.id;
      
      // Verificar se a categoria existe
      const category = await Category.findByPk(categoryId);
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada',
        });
      }

      // Verificar se existem produtos associados à categoria
      const productCount = await category.countProducts();
      
      if (productCount > 0) {
        return res.status(400).json({
          success: false,
          message: 'Não é possível excluir uma categoria que possui produtos',
        });
      }

      // Verificar se existem subcategorias
      const subcategoryCount = await category.countSubcategories();
      
      if (subcategoryCount > 0) {
        return res.status(400).json({
          success: false,
          message: 'Não é possível excluir uma categoria que possui subcategorias',
        });
      }

      // Excluir a categoria
      await category.destroy();

      return res.status(200).json({
        success: true,
        message: 'Categoria excluída com sucesso',
      });
    } catch (error: any) {
      console.error('Erro ao excluir categoria:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Erro ao excluir categoria',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
}

/**
 * Função auxiliar para verificar se uma categoria é subcategoria de outra
 */
async function checkIfSubcategory(parentId: number, categoryId: number): Promise<boolean> {
  // Caso base: se são iguais
  if (parentId === categoryId) {
    return true;
  }
  
  // Buscar as subcategorias do parentId
  const children = await Category.findAll({
    where: { parentId },
    attributes: ['id'],
  });
  
  // Se não tem subcategorias, retorna falso
  if (children.length === 0) {
    return false;
  }
  
  // Verificar recursivamente as subcategorias
  for (const child of children) {
    if (child.get('id') === categoryId) {
      return true;
    }
    
    const isSubcategory = await checkIfSubcategory(child.get('id') as number, categoryId);
    
    if (isSubcategory) {
      return true;
    }
  }
  
  return false;
}

export default new CategoryController(); 