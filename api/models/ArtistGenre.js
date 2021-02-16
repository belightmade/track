module.exports = (sequelize, Sequelize) => {
  const ArtistGenre = sequelize.define(
    'artistGenre',
    {},
    {
      paranoid: true,
      freezeTableName: true,
      tableName: 'artist_genre',
      timestamps: false,
    }
  )

  return ArtistGenre
}
