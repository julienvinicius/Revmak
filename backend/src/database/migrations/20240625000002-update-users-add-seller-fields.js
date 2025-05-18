'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Verificar se as colunas já existem (para evitar erro em caso de reexecução)
    const tableInfo = await queryInterface.describeTable('users');
    
    const columnsToAdd = [];
    
    if (!tableInfo.cpf) {
      columnsToAdd.push(['cpf', {
        type: Sequelize.STRING(14),
        allowNull: true,
        unique: true,
      }]);
    }
    
    if (!tableInfo.cnpj) {
      columnsToAdd.push(['cnpj', {
        type: Sequelize.STRING(18),
        allowNull: true,
        unique: true,
      }]);
    }
    
    if (!tableInfo.phone) {
      columnsToAdd.push(['phone', {
        type: Sequelize.STRING(15),
        allowNull: true,
      }]);
    }
    
    if (!tableInfo.birth_date) {
      columnsToAdd.push(['birth_date', {
        type: Sequelize.DATEONLY,
        allowNull: true,
      }]);
    }
    
    if (!tableInfo.address) {
      columnsToAdd.push(['address', {
        type: Sequelize.STRING,
        allowNull: true,
      }]);
    }
    
    if (!tableInfo.address_number) {
      columnsToAdd.push(['address_number', {
        type: Sequelize.STRING(10),
        allowNull: true,
      }]);
    }
    
    if (!tableInfo.complement) {
      columnsToAdd.push(['complement', {
        type: Sequelize.STRING,
        allowNull: true,
      }]);
    }
    
    if (!tableInfo.neighborhood) {
      columnsToAdd.push(['neighborhood', {
        type: Sequelize.STRING,
        allowNull: true,
      }]);
    }
    
    if (!tableInfo.city) {
      columnsToAdd.push(['city', {
        type: Sequelize.STRING,
        allowNull: true,
      }]);
    }
    
    if (!tableInfo.state) {
      columnsToAdd.push(['state', {
        type: Sequelize.STRING(2),
        allowNull: true,
      }]);
    }
    
    if (!tableInfo.zip_code) {
      columnsToAdd.push(['zip_code', {
        type: Sequelize.STRING(9),
        allowNull: true,
      }]);
    }
    
    if (!tableInfo.profile_picture) {
      columnsToAdd.push(['profile_picture', {
        type: Sequelize.STRING,
        allowNull: true,
      }]);
    }
    
    if (!tableInfo.company_name) {
      columnsToAdd.push(['company_name', {
        type: Sequelize.STRING,
        allowNull: true,
      }]);
    }
    
    if (!tableInfo.is_seller) {
      columnsToAdd.push(['is_seller', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }]);
    }
    
    // Adicionar colunas
    for (const [columnName, columnDefinition] of columnsToAdd) {
      await queryInterface.addColumn('users', columnName, columnDefinition);
    }
    
    // Adicionar índices para otimizar buscas
    if (columnsToAdd.some(([col]) => col === 'is_seller')) {
      await queryInterface.addIndex('users', ['is_seller']);
    }
    if (columnsToAdd.some(([col]) => col === 'cpf')) {
      await queryInterface.addIndex('users', ['cpf']);
    }
    if (columnsToAdd.some(([col]) => col === 'cnpj')) {
      await queryInterface.addIndex('users', ['cnpj']);
    }
  },

  async down(queryInterface, Sequelize) {
    // Lista de colunas a serem removidas
    const columnsToRemove = [
      'cpf',
      'cnpj',
      'phone',
      'birth_date',
      'address',
      'address_number',
      'complement',
      'neighborhood',
      'city',
      'state',
      'zip_code',
      'profile_picture',
      'company_name',
      'is_seller',
    ];
    
    // Remover cada coluna
    for (const columnName of columnsToRemove) {
      await queryInterface.removeColumn('users', columnName);
    }
  }
}; 