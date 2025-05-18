require('dotenv').config();

module.exports = {
  development: {
    username: 'root',
    password: '914914',
    database: 'revmak',
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
    timezone: '-03:00',
    define: {
      timestamps: true,
      underscored: true,
    },
  }, 
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmak_test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
    timezone: '-03:00',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    },
  },
}; 