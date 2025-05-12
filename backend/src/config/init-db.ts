import sequelize, { testConnection } from './database';

// Inicializar o banco de dados
export const initDatabase = async (): Promise<void> => {
  try {
    // Testar a conexão com o banco de dados
    await testConnection();
    
    // Em produção, as migrações devem ser executadas separadamente
    // usando o comando: npm run db:migrate
    if (process.env.NODE_ENV === 'development' && process.env.AUTO_SYNC === 'true') {
      // Sincronizar os modelos com o banco de dados (apenas para desenvolvimento)
      await sequelize.sync({ alter: true });
      console.log('Modelos sincronizados com o banco de dados');
    } else {
      console.log('Usando migrações para gerenciar o esquema do banco de dados');
    }
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
    process.exit(1);
  }
}; 