'use strict'
const genre = require('../data/genre')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('meta_genre', genre, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('meta_genre', null, {})
  },
}
