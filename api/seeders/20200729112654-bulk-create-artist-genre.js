'use strict'
const artistGenre = require('../data/artistGenre')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('artist_genre', artistGenre, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('artist_genre', null, {})
  },
}
