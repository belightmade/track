module.exports = (sequelize, Sequelize) => {
  const MusicLog = sequelize.define(
    'musicLog',
    {
      type: { type: Sequelize.ENUM('hit', 'info'), comment: '로그 타입' },
      action: { type: Sequelize.ENUM('start', 'end'), comment: '액션' },
    },
    {
      freezeTableName: true,
      tableName: 'music_log',
    }
  )

  MusicLog.associate = (database) => {
    MusicLog.belongsTo(database.MusicInfo, { foreignKey: 'musicInfoId' })
  }

  return MusicLog
}
