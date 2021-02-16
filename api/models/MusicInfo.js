module.exports = (sequelize, Sequelize) => {
  const MusicInfo = sequelize.define(
    'musicInfo',
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      name: { type: Sequelize.STRING(100), comment: '곡 이름' },
      tag: { type: Sequelize.STRING(100), comment: '태그' },
      description: { type: Sequelize.TEXT('medium'), comment: '곡 설명' },
      album: { type: Sequelize.STRING(100), comment: '앨범' },
      lyrics: { type: Sequelize.TEXT('medium'), comment: '가사' },
      singer: { type: Sequelize.STRING(100), comment: '가수' },
      releaseDate: { type: Sequelize.DATEONLY, comment: '릴리즈 날짜' },
    },
    {
      paranoid: true,
      freezeTableName: true,
      tableName: 'music_info',
    }
  )
  MusicInfo.associate = (database) => {
    MusicInfo.belongsTo(database.Artist, { foreignKey: 'artistId' })
    MusicInfo.belongsTo(database.MetaGenre, { foreignKey: 'genreId' })
    MusicInfo.hasOne(database.MusicHits, {
      foreignKey: { name: 'musicInfoId' },
    })
    MusicInfo.hasMany(database.MusicRight, {
      foreignKey: { name: 'musicInfoId' },
    })
    MusicInfo.hasMany(database.File, {
      foreignKey: { name: 'musicInfoId' },
    })
  }

  return MusicInfo
}
