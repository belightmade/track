module.exports = (sequelize, Sequelize) => {
  const MusicRight = sequelize.define(
    'musicRight',
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      lyricist: { type: Sequelize.STRING(100), comment: '작사가' },
      songwriter: { type: Sequelize.STRING(100), comment: '작곡가' },
      arranger: { type: Sequelize.STRING(100), comment: '편곡가' },
      singer: { type: Sequelize.STRING(100), comment: '가수' },
    },
    {
      paranoid: true,
      freezeTableName: true,
      tableName: 'music_right',
    }
  )

  MusicRight.associate = (database) => {
    MusicRight.belongsTo(database.MusicInfo, { foreignKey: 'musicInfoId' })
  }

  return MusicRight
}
