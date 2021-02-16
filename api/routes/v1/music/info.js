const router = require('express').Router()
const { v4: uuidv4 } = require('uuid')

const {
  Artist,
  MusicInfo,
  MusicHits,
  File,
  MusicRight,
} = require('../../../models')

router.get('/', async (req, res, next) => {
  try {
    const musics = await MusicInfo.findAll({
      include: [
        { model: Artist },
        { model: MusicRight },
        { model: MusicHits },
        { model: File },
      ],
    })

    res.json(musics)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const musicInfoId = uuidv4()

    await MusicInfo.create({
      id: musicInfoId,
      name: req.body.name,
      tag: req.body.tag,
      description: req.body.description,
      album: req.body.album,
      lyrics: req.body.lyrics,
      singer: req.body.singer,
      releaseDate: req.body.releaseDate,
      genreId: req.body.genreId,
      artistId: req.body.artistId,
    })

    await Promise.all([
      MusicRight.create({
        lyricist: req.body.lyricist,
        songwriter: req.body.songwriter,
        arranger: req.body.arranger,
        singer: req.body.singer,
        musicInfoId,
      }),
      MusicHits.create({
        musicInfoId,
        hits: 0,
      }),
      File.update(
        { musicInfoId },
        {
          where: {
            id: [req.body.wavId, req.body.mp3Id, req.body.coverId],
          },
        }
      ),
    ])

    res.send('ok')
  } catch (error) {
    next(error)
  }
})

module.exports = router
