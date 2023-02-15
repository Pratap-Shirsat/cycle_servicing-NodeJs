require('dotenv').config();

module.exports = {
  development: {
    username: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DBNAME,
    host: process.env.HOST,
    port: process.env.PORT,
    dialect: process.env.DIALECT,
  },
};
