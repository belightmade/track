const router = require('express').Router()
const { getPlaylist, setPlaylist } = require('../../../services/Redis')

const {
  Artist,
  MusicInfo,
  MusicHits,
  File,
  MusicRight,
} = require('../../../models')

router.get('/', async (req, res, next) => {
  try {
    const playlistIds = await getPlaylist(req.sessionID)

    const playlist = await MusicInfo.findAll({
      where: {
        id: playlistIds,
      },
      include: [
        { model: Artist },
        { model: MusicRight },
        { model: MusicHits },
        { model: File },
      ],
    })

    playlist.sort(
      (a, b) => playlistIds.indexOf(a.id) - playlistIds.indexOf(b.id)
    )

    res.send(playlist)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    await setPlaylist(req.sessionID, req.body.playlist)

    res.send('ok')
  } catch (error) {
    next(error)
  }
})

module.exports = router
