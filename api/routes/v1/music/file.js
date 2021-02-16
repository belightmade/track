const fs = require('fs')

const router = require('express').Router()
const mp3Duration = require('mp3-duration')
const { v4: uuidv4 } = require('uuid')
const multer = require('multer')

const S3 = require('../../../connections/ObjectStorage')
const ObjectStorage = require('../../../services/multer/ObjectStorage')
const uploadObject = multer({ storage: ObjectStorage({}) })
const FFmpeg = require('../../../services/FFmpeg')
const { MusicLog, File } = require('../../../models')

router.get('/:musicInfoId', async (req, res, next) => {
  try {
    const {
      query: { role = 'mp3' },
      params: { musicInfoId },
    } = req
    const cover = await File.findOne({
      where: {
        musicInfoId,
        role,
      },
    })

    const inStream = S3.getObject({
      Bucket: process.env.NCLOUD_BUCKET_NAME,
      Key: cover.name,
    }).createReadStream()

    MusicLog.create({
      type: 'hit',
      action: 'start',
      musicInfoId,
    })
    inStream.pipe(res)
  } catch (error) {
    next(error)
  }
})

router.post('/cover', uploadObject.single('cover'), async (req, res, next) => {
  try {
    await File.create({ ...req.file, role: 'cover' })

    fs.unlinkSync(req.file.path + req.file.name, (err) => {
      if (err) throw err
    })
    res.json({ coverId: req.file.id })
  } catch (error) {
    next(error)
  }
})

router.post('/', uploadObject.single('file'), async (req, res, next) => {
  const { file } = req
  try {
    const fileFullPath = file.path + file.name
    // mp3 변환 및 Object storage 업로드
    const mp3Id = uuidv4()

    const resultPath = await FFmpeg.convert(
      fileFullPath,
      file.path,
      `${mp3Id}.mp3`
    )

    const duration = await mp3Duration(resultPath)
    const inStream = fs.createReadStream(resultPath)

    let mp3FileSize = 0
    S3.putObject({
      Bucket: process.env.NCLOUD_BUCKET_NAME,
      Key: mp3Id + '.mp3',
      ACL: 'public-read',
      Body: inStream,
    })
      .on('error', (err) => {
        next(err)
      })
      .on('httpUploadProgress', (data) => {
        mp3FileSize = data.total
      })
      .send((err, { ETag }) => {
        if (err) return next(err)

        fs.unlink(resultPath, (err) => {
          if (err) console.error(err)
        })
        fs.unlink(fileFullPath, (err) => {
          if (err) console.error(err)
        })
        File.create({ ...file, duration, role: 'wav' })
        File.create({
          ...file,
          id: mp3Id,
          duration,
          role: 'mp3',
          mimetype: 'audio/mpeg',
          name: mp3Id + '.mp3',
          originalname:
            file.originalname.slice(0, file.originalname.length - 3) + 'mp3',
          location:
            process.env.NCLOUD_OBJECT_STORAGE_LOCATION + '/' + mp3Id + '.mp3',
          size: mp3FileSize,
          etag: ETag,
        })
        res.json({ wavId: file.id, mp3Id })
      })
  } catch (error) {
    next(error)
  }
})

module.exports = router
