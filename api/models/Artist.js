module.exports = (sequelize, Sequelize) => {
  const Artist = sequelize.define(
    'artist',
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      name: { type: Sequelize.STRING(100), comment: '아티스트 이름' },
      group: { type: Sequelize.STRING(100), comment: '그룹' },
      position: { type: Sequelize.STRING(100), comment: '세부 역할' },
    },
    {
      paranoid: true,
      freezeTableName: true,
      tableName: 'artist',
    }
  )

  Artist.associate = (database) => {
    Artist.belongsToMany(database.MetaGenre, {
      through: database.ArtistGenre,
      foreignKey: 'artistId',
    })
  }

  return Artist
}
