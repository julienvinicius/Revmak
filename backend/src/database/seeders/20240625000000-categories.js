'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    // Criar categorias principais
    const mainCategories = [
      {
        name: 'Fogões',
        slug: 'fogoes',
        description: 'Fogões industriais e comerciais para restaurantes',
        icon: 'fire',
        parent_id: null,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Refrigeração',
        slug: 'refrigeracao',
        description: 'Equipamentos de refrigeração para cozinhas profissionais',
        icon: 'snowflake',
        parent_id: null,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Preparação',
        slug: 'preparacao',
        description: 'Equipamentos para preparação de alimentos',
        icon: 'blender',
        parent_id: null,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Fornos',
        slug: 'fornos',
        description: 'Fornos comerciais e industriais',
        icon: 'burn',
        parent_id: null,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Utensílios',
        slug: 'utensilios',
        description: 'Utensílios e acessórios para cozinhas profissionais',
        icon: 'utensils',
        parent_id: null,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Móveis',
        slug: 'moveis',
        description: 'Móveis e instalações para restaurantes',
        icon: 'chair',
        parent_id: null,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ];

    await queryInterface.bulkInsert('categories', mainCategories, {});

    // Agora buscar os IDs das categorias criadas para adicionar subcategorias
    const categories = await queryInterface.sequelize.query(
      `SELECT id, slug FROM categories;`
    );
    
    const categoryRows = categories[0];
    const categoryMap = {};
    
    categoryRows.forEach(category => {
      categoryMap[category.slug] = category.id;
    });

    // Criar subcategorias
    const subcategories = [
      // Subcategorias de Fogões
      {
        name: 'Fogões Industriais',
        slug: 'fogoes-industriais',
        description: 'Fogões industriais de alta pressão',
        icon: 'fire',
        parent_id: categoryMap['fogoes'],
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Fogões a Gás',
        slug: 'fogoes-a-gas',
        description: 'Fogões comerciais a gás',
        icon: 'fire',
        parent_id: categoryMap['fogoes'],
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Cooktops',
        slug: 'cooktops',
        description: 'Cooktops profissionais',
        icon: 'fire',
        parent_id: categoryMap['fogoes'],
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      
      // Subcategorias de Refrigeração
      {
        name: 'Geladeiras Comerciais',
        slug: 'geladeiras-comerciais',
        description: 'Geladeiras para uso comercial',
        icon: 'snowflake',
        parent_id: categoryMap['refrigeracao'],
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Freezers',
        slug: 'freezers',
        description: 'Freezers industriais e comerciais',
        icon: 'snowflake',
        parent_id: categoryMap['refrigeracao'],
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Expositores Refrigerados',
        slug: 'expositores-refrigerados',
        description: 'Expositores refrigerados para alimentos',
        icon: 'snowflake',
        parent_id: categoryMap['refrigeracao'],
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      
      // Subcategorias de Preparação
      {
        name: 'Liquidificadores',
        slug: 'liquidificadores',
        description: 'Liquidificadores industriais e comerciais',
        icon: 'blender',
        parent_id: categoryMap['preparacao'],
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Processadores',
        slug: 'processadores',
        description: 'Processadores de alimentos profissionais',
        icon: 'blender',
        parent_id: categoryMap['preparacao'],
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Batedeiras',
        slug: 'batedeiras',
        description: 'Batedeiras industriais',
        icon: 'blender',
        parent_id: categoryMap['preparacao'],
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      
      // Subcategorias de Fornos
      {
        name: 'Fornos Combinados',
        slug: 'fornos-combinados',
        description: 'Fornos combinados profissionais',
        icon: 'burn',
        parent_id: categoryMap['fornos'],
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Fornos de Pizza',
        slug: 'fornos-de-pizza',
        description: 'Fornos especiais para pizza',
        icon: 'burn',
        parent_id: categoryMap['fornos'],
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Fornos de Convecção',
        slug: 'fornos-de-conveccao',
        description: 'Fornos de convecção para uso comercial',
        icon: 'burn',
        parent_id: categoryMap['fornos'],
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ];

    await queryInterface.bulkInsert('categories', subcategories, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
}; 