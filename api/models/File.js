module.exports = (sequelize, Sequelize) => {
  const File = sequelize.define(
    'file',
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      name: { type: Sequelize.STRING(100), comment: '업로드된 파일 이름' },
      hash: { type: Sequelize.STRING(32), comment: '파일 md5 hash' },
      width: { type: Sequelize.INTEGER, comment: '이미지 파일 가로' },
      height: { type: Sequelize.INTEGER, comment: '이미지 파일 세로' },
      size: { type: Sequelize.INTEGER, comment: '파일 사이즈' },
      duration: { type: Sequelize.INTEGER, comment: '음악 파일 재생시간' },
      role: {
        type: Sequelize.ENUM('wav', 'mp3', 'cover'),
        comment: '파일 역할',
      },

      location: { type: Sequelize.STRING, comment: '파일 원본 이름' },
      bucket: { type: Sequelize.STRING(100), comment: 'Storage bucket 이름' },
      originalname: { type: Sequelize.STRING(100), comment: '파일 원본 이름' },
      mimetype: { type: Sequelize.STRING(100), comment: '파일 mimetype' },
      encoding: { type: Sequelize.STRING(100), comment: '파일 encoding' },
      etag: { type: Sequelize.STRING(100), comment: '파일 ETag' },
    },
    {
      paranoid: true,
      freezeTableName: true,
      tableName: 'file',
    }
  )
  File.associate = (database) => {
    File.belongsTo(database.MusicInfo, { foreignKey: 'musicInfoId' })
  }

  return File
}
