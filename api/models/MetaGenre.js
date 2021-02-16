module.exports = (sequelize, Sequelize) => {
  const MetaGenre = sequelize.define(
    'metaGenre',
    {
      name: { type: Sequelize.STRING(100), comment: '장르 이름' },
    },
    {
      paranoid: true,
      freezeTableName: true,
      tableName: 'meta_genre',
      timestamps: false,
    }
  )

  MetaGenre.associate = (database) => {
    MetaGenre.belongsToMany(database.Artist, {
      through: database.ArtistGenre,
      foreignKey: 'genreId',
    })
    MetaGenre.hasMany(database.MusicInfo, { foreignKey: 'genreId' })
  }

  return MetaGenre
}
