import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Mostrar as variáveis de ambiente carregadas (sem mostrar senhas)
console.log('Database Config - Environment variables loaded:', {
  NODE_ENV: process.env.NODE_ENV || 'not set',
  DB_NAME: process.env.DB_NAME || 'not set',
  DB_USER: process.env.DB_USER || 'not set',
  DB_PASSWORD: process.env.DB_PASSWORD ? '******' : 'not set',
  DB_HOST: process.env.DB_HOST || 'not set',
  DB_PORT: process.env.DB_PORT || 'not set',
  dotenvLoaded: !!dotenv
});

// Configuração do banco de dados
const dbName = process.env.DB_NAME || 'revmak';
const dbUser = process.env.DB_USER || 'root';
// Se não houver senha definida, usar string vazia
const dbPassword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '3306', 10);

console.log('Database Config - Using configuration:', {
  dbName,
  dbUser,
  dbPassword: dbPassword ? '******' : 'empty',
  dbHost,
  dbPort
});

// Criação da instância do Sequelize
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: (msg) => {
    console.log(`Database SQL - ${msg}`);
    return true;
  },
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
    console.log('Database - Testing connection...');
    await sequelize.authenticate();
    console.log('Database - Connection established successfully.');
  } catch (error) {
    console.error('Database - Error connecting to database:', error);
    // Detalhes adicionais de diagnóstico
    console.error('Database - Connection details (for debugging):', {
      host: dbHost,
      port: dbPort,
      user: dbUser,
      database: dbName,
      password: dbPassword ? 'password_provided' : 'no_password'
    });
    process.exit(1);
  }
};

export default sequelize; 