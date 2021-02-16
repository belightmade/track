const router = require('express').Router()
const { MusicHits, MusicLog, File, sequelize } = require('../../../models')

router.post('/end/:musicInfoId', async (req, res, next) => {
  try {
    const { musicInfoId } = req.params
    const now = Date.now()

    MusicLog.create({ type: 'hit', action: 'end', createdAt: now, musicInfoId })

    const [startLog, mp3File] = await Promise.all([
      MusicLog.findOne({
        where: { type: 'hit', action: 'start', musicInfoId },
        attributes: ['createdAt'],
        order: [['createdAt', 'DESC']],
      }),
      File.findOne({
        where: { role: 'mp3', musicInfoId },
        attributes: ['duration'],
      }),
    ])

    if ((now - startLog.createdAt) / 1000 > mp3File.duration)
      MusicHits.update(
        { hits: sequelize.literal('hits + 1') },
        { where: { musicInfoId } }
      )

    res.send('ok')
  } catch (error) {
    next(error)
  }
})

module.exports = router
