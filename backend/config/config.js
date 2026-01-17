require('dotenv').config();

module.exports = {
  development: {
     username: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'ecommerce',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3309,  // Note: Port 3309, not 3306!
    dialect: process.env.DB_DIALECT || 'mysql',
    dialectOptions: {
      decimalNumbers: true
    },
    logging: false
  },

  test: {
     username: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'ecommerce_test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3309,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false
  },

  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT
  }
};
