'use strict'

const artists = require('../data/artist')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('artist', artists, {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('artist', null, {})
  },
}
