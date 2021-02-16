module.exports = (sequelize, Sequelize) => {
  const MusicHits = sequelize.define(
    'musicHits',
    {
      hits: { type: Sequelize.INTEGER, comment: '조회수' },
    },
    {
      paranoid: true,
      freezeTableName: true,
      tableName: 'music_hits',
      timestamps: false,
    }
  )

  MusicHits.associate = (database) => {
    MusicHits.belongsTo(database.MusicInfo, { foreignKey: 'musicInfoId' })
  }

  return MusicHits
}
