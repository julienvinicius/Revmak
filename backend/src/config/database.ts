import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Configuração do banco de dados
const dbName = process.env.DB_NAME || 'revmak';
const dbUser = process.env.DB_USER || 'root';
// Se não houver senha definida, usar string vazia
const dbPassword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '3306', 10);

// Criação da instância do Sequelize
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
  },
  timezone: '-03:00', // Timezone para Brasil (GMT-3)
  define: {
    timestamps: true, // Adicionar created_at e updated_at automaticamente
    underscored: true, // Usar snake_case para nomes de colunas
  },
});

// Função para testar a conexão
export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
};

export default sequelize; 