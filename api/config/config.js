const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') })

module.exports = {
  development: {
    username: process.env.DEVELOPMENT_DATABASE_USERNAME,
    password: process.env.DEVELOPMENT_DATABASE_PASSWORD,
    database: process.env.DEVELOPMENT_DATABASE_NAME,
    host: process.env.DEVELOPMENT_DATABASE_HOST,
    dialect: process.env.DEVELOPMENT_DATABASE_DIALECT,
    dialectOptions: {
      timezone: process.env.DEVELOPMENT_DATABASE_TIMEZONE,
    },
    logging: false,
  },
  test: {
    username: process.env.TEST_DATABASE_USERNAME,
    password: process.env.TEST_DATABASE_PASSWORD,
    database: process.env.TEST_DATABASE_NAME,
    host: process.env.TEST_DATABASE_HOST,
    dialect: process.env.TEST_DATABASE_DIALECT,
    dialectOptions: {
      timezone: process.env.TEST_DATABASE_TIMEZONE,
    },
    logging: false,
  },
  production: {
    username: process.env.PRODUCTION_DATABASE_USERNAME,
    password: process.env.PRODUCTION_DATABASE_PASSWORD,
    database: process.env.PRODUCTION_DATABASE_NAME,
    host: process.env.PRODUCTION_DATABASE_HOST,
    dialect: process.env.PRODUCTION_DATABASE_DIALECT,
    dialectOptions: {
      timezone: process.env.PRODUCTION_DATABASE_TIMEZONE,
    },
    logging: false,
  },
}
